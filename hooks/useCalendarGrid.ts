'use client';

import { useState, useEffect } from 'react';
import { format, startOfYear, endOfYear, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAccessibleActivities } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { generateCalendarData, getActiveDaysPercentage } from '@/utils/stats';
import { useQueryClient } from '@tanstack/react-query';

export function useCalendarGrid() {
  const { user, userProfile, loading } = useAuth();
  const { subscription, canAccessYear, hasAccess, canAccessPeriod } = useSubscription();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showYearPaywall, setShowYearPaywall] = useState(false);
  
  // États pour le carousel
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const queryClient = useQueryClient();
  const { data: activities = [], isLoading: activitiesLoading, refetch: refetchActivities } = useAccessibleActivities(user?.uid);

  // Forcer un refetch des activités quand on arrive sur la page calendrier
  useEffect(() => {
    if (user?.uid && !loading) {
      // Invalider le cache des activités pour forcer un refetch complet
      queryClient.invalidateQueries({ 
        queryKey: ['activities', 'accessible', user.uid] 
      });
      // Refetch les activités pour s'assurer d'avoir les dernières données
      refetchActivities();
    }
  }, [user?.uid, loading, refetchActivities, queryClient]);

  // Détecter la taille d'écran
  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  // Générer les données du calendrier pour l'année sélectionnée
  const startDate = startOfYear(new Date(selectedYear, 0, 1));
  const endDate = endOfYear(new Date(selectedYear, 0, 1));
  const calendarDays = generateCalendarData(activities, startDate, endDate);
  
  // Générer les données pour chaque mois (limité selon l'abonnement)
  const monthsData = [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Gratuit = seulement le mois en cours, Premium = tous les 12 mois de l'année
  const hasAdvancedStats = subscription?.plan === 'premium' || subscription?.plan === 'premium-plus';
  
  // Déterminer le nombre de mois selon la taille d'écran et l'abonnement
  const getMaxMonths = () => {
    if (!hasAdvancedStats) return 1;
    switch (screenSize) {
      case 'mobile': return 1;
      case 'tablet': return 3;
      case 'desktop': return 4;
      default: return 4;
    }
  };
  
  const maxMonths = getMaxMonths();
  const startMonth = hasAdvancedStats ? 0 : currentMonth; // Premium = tous les mois de l'année

  // Ajuster l'index du mois selon le type d'abonnement et la taille d'écran
  useEffect(() => {
    if (subscription && !activitiesLoading) {
      const hasAdvancedStats = subscription?.plan === 'premium' || subscription?.plan === 'premium-plus';
      if (hasAdvancedStats) {
        // Pour les utilisateurs premium, positionner par défaut sur aujourd'hui
        // en affichant le mois courant dans le dernier slot visible
        const startIndex = Math.max(0, currentMonth - maxMonths + 1);
        setCurrentMonthIndex(startIndex);
      } else {
        // Pour les utilisateurs gratuits, commencer sur l'index 0 (seul mois disponible)
        setCurrentMonthIndex(0);
      }
    }
  }, [subscription, activitiesLoading, screenSize, maxMonths]);
  
  // Pour les utilisateurs gratuits, forcer l'année courante
  const displayYear = hasAdvancedStats ? selectedYear : currentYear;
  
  // Pour les utilisateurs premium, générer tous les 12 mois de l'année
  const totalMonths = hasAdvancedStats ? 12 : maxMonths;
  for (let month = startMonth; month < startMonth + totalMonths; month++) {
    const monthStart = new Date(displayYear, month, 1);
    const monthEnd = new Date(displayYear, month + 1, 0); // Dernier jour du mois
    const monthName = format(monthStart, 'MMMM yyyy', { locale: fr });
    
    // Calculer le premier jour de la grille (peut être du mois précédent)
    const firstDayOfGrid = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lundi
    const lastDayOfGrid = endOfWeek(monthEnd, { weekStartsOn: 1 }); // Dimanche
    
    // Générer tous les jours de la grille du mois
    const allDaysInGrid = eachDayOfInterval({ start: firstDayOfGrid, end: lastDayOfGrid });
    
    // Organiser en semaines
    const weeks = [];
    for (let i = 0; i < allDaysInGrid.length; i += 7) {
      const week = allDaysInGrid.slice(i, i + 7).map(date => {
        const dateString = format(date, 'yyyy-MM-dd');
        const dayData = calendarDays.find(d => d.date === dateString);
        const isCurrentMonth = date.getMonth() === month;
        
        const today = new Date();
        const isFuture = date > today;
        
        return {
          date: dateString,
          day: date.getDate(),
          isCurrentMonth,
          isToday: dateString === format(today, 'yyyy-MM-dd'),
          isFuture,
          color: dayData?.color || 'blue',
          totalActivities: dayData?.totalActivities || 0,
          hasData: dayData?.hasData || false
        };
      });
      weeks.push(week);
    }
    
    monthsData.push({
      month,
      name: monthName,
      shortName: format(monthStart, 'MMMM', { locale: fr }),
      weeks
    });
  }

  const activeDaysPercentage = getActiveDaysPercentage(calendarDays);

  // Fonctions de navigation simple
  const goToPreviousMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const goToNextMonth = () => {
    // Pour les utilisateurs premium, navigation dans tous les 12 mois
    const maxIndex = hasAdvancedStats ? 11 : maxMonths - 1;
    if (currentMonthIndex < maxIndex) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    // Pour les utilisateurs premium, positionner pour que le mois en cours soit visible
    if (hasAdvancedStats) {
      const currentMonthIndex = now.getMonth();
      // Positionner le carousel pour que le mois en cours soit dans le dernier slot si possible
      const startIndex = Math.max(0, currentMonthIndex - maxMonths + 1);
      setCurrentMonthIndex(startIndex);
      setSelectedYear(now.getFullYear()); // Remettre l'année courante
    } else {
      setCurrentMonthIndex(0);
    }
  };

  return {
    // États
    user,
    userProfile,
    loading,
    subscription,
    canAccessYear,
    hasAccess,
    canAccessPeriod,
    selectedYear,
    setSelectedYear,
    currentMonthIndex,
    setCurrentMonthIndex,
    showComingSoonModal,
    setShowComingSoonModal,
    showYearPaywall,
    setShowYearPaywall,
    screenSize,
    activities,
    activitiesLoading,
    
    // Données calculées
    monthsData,
    calendarDays,
    activeDaysPercentage,
    hasAdvancedStats,
    maxMonths,
    displayYear,
    currentMonth,
    
    // Fonctions de navigation
    goToPreviousMonth,
    goToNextMonth,
    goToCurrentMonth,
  };
}
