'use client';

import React, { useState } from 'react';
import { format, startOfYear, endOfYear, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { useAccessibleConsumptions } from '@/hooks/useConsumptions';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { generateCalendarData, getGreenDaysPercentage } from '@/utils/stats';
import { CalendarDay } from '@/types';
import CalendarDayModal from './CalendarDayModal';
import { CalendarSkeleton, FreeCalendarSkeleton, PremiumCalendarSkeleton } from '@/components/ui/Skeleton';
import UpgradePrompt from '@/components/subscription/UpgradePrompt';
import { Flower, BarChart3, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function CalendarGrid() {
  const { user, userProfile, loading } = useAuth();
  const { subscription, canAccessYear, hasAccess, canAccessPeriod } = useSubscription();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // Sera ajusté selon le type d'abonnement
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  
  const { data: consumptions = [], isLoading } = useAccessibleConsumptions(user?.uid);

  // Ajuster l'index du mois selon le type d'abonnement
  React.useEffect(() => {
    if (subscription && !isLoading) {
      const hasAdvancedStats = subscription?.plan === 'premium' || subscription?.plan === 'premium-plus';
      if (hasAdvancedStats) {
        // Pour les utilisateurs premium, commencer sur le mois actuel (0-11)
        setCurrentMonthIndex(new Date().getMonth());
      } else {
        // Pour les utilisateurs gratuits, commencer sur l'index 0 (seul mois disponible)
        setCurrentMonthIndex(0);
      }
    }
  }, [subscription, isLoading]);

  // Si le profil utilisateur est encore en cours de chargement, afficher un skeleton
  if (loading || !userProfile) {
    return <CalendarSkeleton />;
  }

  // Vérifier si l'utilisateur peut accéder à cette année
  const canAccessCurrentYear = canAccessYear(selectedYear);
  
  // Générer les données du calendrier pour l'année sélectionnée
  const startDate = startOfYear(new Date(selectedYear, 0, 1));
  const endDate = endOfYear(new Date(selectedYear, 0, 1));
  const calendarDays = generateCalendarData(consumptions, startDate, endDate);
  
  // Générer les données pour chaque mois (limité selon l'abonnement)
  const monthsData = [];
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Gratuit = seulement le mois en cours, Premium = année complète
  const hasAdvancedStats = subscription?.plan === 'premium' || subscription?.plan === 'premium-plus';
  const maxMonths = hasAdvancedStats ? 12 : 1;
  const startMonth = hasAdvancedStats ? 0 : currentMonth;
  
  
  // Pour les utilisateurs gratuits, forcer l'année courante
  const displayYear = hasAdvancedStats ? selectedYear : currentYear;
  
  for (let month = startMonth; month < startMonth + maxMonths; month++) {
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
                          color: dayData?.color || 'green',
                          totalConsumptions: dayData?.totalConsumptions || 0,
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

  const greenDaysPercentage = getGreenDaysPercentage(calendarDays);

  const colorClasses = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-400',
    orange: 'bg-orange-400',
    red: 'bg-rose-400',
  };

  // Fonctions de navigation pour mobile (uniquement pour les utilisateurs premium)
  const goToPreviousMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    } else {
      setCurrentMonthIndex(11);
      setSelectedYear(selectedYear - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonthIndex < 11) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    } else {
      setCurrentMonthIndex(0);
      setSelectedYear(selectedYear + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setCurrentMonthIndex(now.getMonth());
    setSelectedYear(now.getFullYear());
  };

  // Afficher le skeleton adapté selon le plan si les données sont en cours de chargement
  if (!user || isLoading) {
    return (
      <div className="space-y-6">
        {/* Contrôles skeleton */}
        <div className="flex items-center justify-between">
          <div className="bg-white/70 text-gray-800 rounded-2xl px-4 py-3 border border-gray-200 shadow-md backdrop-blur-sm">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
          <div className="bg-emerald-50 rounded-2xl px-4 py-3 border border-emerald-100 text-center flex items-center justify-center">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        </div>

        {/* Skeleton adapté selon le plan */}
        {hasAdvancedStats ? <PremiumCalendarSkeleton /> : <FreeCalendarSkeleton />}
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <div className="flex items-center justify-between">
        <div className="bg-white/70 text-gray-800 rounded-2xl px-4 py-3 border border-gray-200 shadow-md backdrop-blur-sm">
          {hasAdvancedStats ? (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-sm font-medium focus:outline-none"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{displayYear}</span>
              <button
                onClick={() => {
                  // Rediriger vers le tunnel d'achat
                  window.location.href = '/subscription';
                }}
                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 hover:text-amber-800 rounded-lg text-xs font-medium transition-colors duration-200"
                title="Changement d'année - Fonctionnalité Premium"
              >
                Premium
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-emerald-50 rounded-2xl px-4 py-3 border border-emerald-100 text-center flex items-center justify-center">
          <div className="flex items-center gap-1">
            <div className="text-2xl font-light text-emerald-700">{greenDaysPercentage}%</div>
            <div className="text-xs text-emerald-600 font-medium">de sérénité</div>
          </div>
        </div>
      </div>

      {/* Calendrier gratuit - version desktop */}
      {hasAdvancedStats !== true && (
        <div className="hidden md:flex justify-center">
          <div className="inline-block">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            {monthsData.map((month) => (
              <div key={month.month}>
                {/* En-tête du mois */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800 capitalize">
                    {month.shortName}
                  </h3>
                  <div className="text-sm text-gray-600">{displayYear}</div>
                </div>
                
                {/* En-têtes des jours de la semaine */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                    <div key={index} className="text-sm font-medium text-gray-500 text-center py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Grille des jours du mois */}
                <div className="space-y-2">
                  {month.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-2">
                      {week.map((day, dayIndex) => {
                        const dayData = {
                          date: day.date,
                          color: day.color,
                          totalConsumptions: day.totalConsumptions,
                          hasData: day.hasData
                        } as CalendarDay;
                        
                        // Vérifier si l'utilisateur peut accéder à cette date
                        const [year, month, dayOfMonth] = day.date.split('-').map(Number);
                        const dayDate = new Date(year, month - 1, dayOfMonth);
                        const canAccess = canAccessPeriod(dayDate);
                        const isClickable = day.isCurrentMonth && !day.isFuture;
                        
                        return (
                          <button
                            key={dayIndex}
                            onClick={() => {
                              if (isClickable) {
                                // Toujours afficher la modale, même pour les jours bloqués
                                setSelectedDay(dayData);
                              }
                            }}
                            disabled={!day.isCurrentMonth || day.isFuture}
                            className={`
                              relative w-12 h-12 rounded-xl text-sm font-medium transition-all duration-200
                              flex items-center justify-center
                              ${!day.isCurrentMonth 
                                ? 'text-gray-300 cursor-default'
                                : day.isFuture
                                ? 'bg-gray-200 text-gray-500 cursor-default'
                                : !canAccess
                                ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500 opacity-60 cursor-pointer'
                                : `${colorClasses[day.color]} text-white hover:scale-110 hover:shadow-lg`
                              }
                              ${day.isToday && day.isCurrentMonth 
                                ? 'ring-2 ring-gray-800' 
                                : ''
                              }
                            `}
                            title={
                              day.isCurrentMonth 
                                ? !canAccess
                                  ? `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - Cliquez pour découvrir Premium et accéder à l'historique complet`
                                  : `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - ${day.totalConsumptions} consommation${day.totalConsumptions > 1 ? 's' : ''}`
                                : ''
                            }
                          >
                            {day.day}
                            
                            {/* Indicateur discret pour aujourd'hui */}
                            {day.isToday && day.isCurrentMonth && (
                              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                            )}
                            
                            {/* Indicateur pour les dates non accessibles */}
                            {!canAccess && day.isCurrentMonth && !day.isFuture && (
                              <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-amber-500 rounded-full"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                
                {/* Statistiques du mois */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-3xl font-light text-emerald-600">
                        {month.weeks.flat().filter(d => d.isCurrentMonth && d.color === 'green').length}
                      </div>
                      <div className="text-gray-600 font-medium">Jours calmes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-light text-purple-600">
                        {month.weeks.flat().reduce((sum, d) => d.isCurrentMonth ? sum + d.totalConsumptions : sum, 0)}
                      </div>
                      <div className="text-gray-600 font-medium">Consommations totales</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}


      {/* Version mobile avec pagination - seulement pour les utilisateurs gratuits */}
      {hasAdvancedStats !== true && (
        <div className="md:hidden">
        {/* Navigation mobile - seulement pour les utilisateurs premium */}
        {hasAdvancedStats ? (
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="flex items-center justify-center w-12 h-12 bg-white/70 text-gray-700 rounded-2xl border border-gray-200 hover:bg-white/90 transition-all duration-200 shadow-md backdrop-blur-sm"
              title="Mois précédent"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 capitalize">
                {monthsData[currentMonthIndex]?.name || 'Chargement...'}
              </h3>
              <button
                onClick={goToCurrentMonth}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Retour à aujourd'hui
              </button>
            </div>
            
            <button
              onClick={goToNextMonth}
              className="flex items-center justify-center w-12 h-12 bg-white/70 text-gray-700 rounded-2xl border border-gray-200 hover:bg-white/90 transition-all duration-200 shadow-md backdrop-blur-sm"
              title="Mois suivant"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          /* En-tête simple pour les utilisateurs freemium */
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 capitalize">
              {monthsData[currentMonthIndex]?.name || 'Chargement...'}
            </h3>
          </div>
        )}

        {/* Calendrier mobile - mois unique */}
        {monthsData.length > 0 && monthsData[currentMonthIndex] ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
            {/* En-têtes des jours de la semaine */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <div key={index} className="text-sm font-medium text-gray-500 text-center py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Grille des jours du mois */}
            <div className="space-y-2">
              {monthsData[currentMonthIndex].weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((day, dayIndex) => {
                    const dayData = {
                      date: day.date,
                      color: day.color,
                      totalConsumptions: day.totalConsumptions,
                      hasData: day.hasData
                    } as CalendarDay;
                    
                    // Vérifier si l'utilisateur peut accéder à cette date (version mobile)
                    const [year, month, dayOfMonth] = day.date.split('-').map(Number);
                    const dayDate = new Date(year, month - 1, dayOfMonth);
                    const canAccess = canAccessPeriod(dayDate);
                    
                    return (
                      <button
                        key={dayIndex}
                        onClick={() => {
                          if (day.isCurrentMonth && !day.isFuture) {
                            // Toujours afficher la modale, même pour les jours bloqués
                            setSelectedDay(dayData);
                          }
                        }}
                        disabled={!day.isCurrentMonth || day.isFuture}
                        className={`
                          relative w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200
                          flex items-center justify-center
                          ${!day.isCurrentMonth 
                            ? 'text-gray-300 cursor-default'
                            : day.isFuture
                            ? 'bg-gray-200 text-gray-500 cursor-default'
                            : !canAccess
                            ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500 opacity-60 cursor-pointer'
                            : `${colorClasses[day.color]} text-white hover:scale-110 hover:shadow-lg`
                          }
                          ${day.isToday && day.isCurrentMonth 
                            ? 'ring-2 ring-gray-800' 
                            : ''
                          }
                        `}
                        title={
                          day.isCurrentMonth 
                            ? !canAccess
                              ? `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - Cliquez pour découvrir Premium et accéder à l'historique complet`
                              : `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - ${day.totalConsumptions} consommation${day.totalConsumptions > 1 ? 's' : ''}`
                            : ''
                        }
                      >
                        {day.day}
                        
                        {/* Indicateur discret pour aujourd'hui */}
                        {day.isToday && day.isCurrentMonth && (
                          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                        )}
                        
                        {/* Indicateur pour les dates non accessibles */}
                        {!canAccess && day.isCurrentMonth && !day.isFuture && (
                          <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-amber-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Statistiques du mois */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-light text-emerald-600">
                    {monthsData[currentMonthIndex].weeks.flat().filter(d => d.isCurrentMonth && d.color === 'green').length}
                  </div>
                  <div className="text-gray-600 font-medium">Jours calmes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-light text-purple-600">
                    {monthsData[currentMonthIndex].weeks.flat().reduce((sum, d) => d.isCurrentMonth ? sum + d.totalConsumptions : sum, 0)}
                  </div>
                  <div className="text-gray-600 font-medium">Consommations totales</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg text-center">
            <div className="text-gray-500 mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium">Chargement du calendrier...</p>
              <p className="text-sm text-gray-400 mt-2">
                {hasAdvancedStats ? 'Préparation de votre calendrier complet' : 'Préparation de votre calendrier du mois'}
              </p>
            </div>
          </div>
        )}
        </div>
      )}


      {/* Version mobile - calendrier premium avec pagination */}
      {hasAdvancedStats && (
        <div className="md:hidden">
          {/* Navigation mobile pour les utilisateurs premium */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="flex items-center justify-center w-12 h-12 bg-white/70 text-gray-700 rounded-2xl border border-gray-200 hover:bg-white/90 transition-all duration-200 shadow-md backdrop-blur-sm"
              title="Mois précédent"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 capitalize">
                {monthsData[currentMonthIndex]?.name || 'Chargement...'}
              </h3>
              <button
                onClick={goToCurrentMonth}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Retour à aujourd'hui
              </button>
            </div>
            
            <button
              onClick={goToNextMonth}
              className="flex items-center justify-center w-12 h-12 bg-white/70 text-gray-700 rounded-2xl border border-gray-200 hover:bg-white/90 transition-all duration-200 shadow-md backdrop-blur-sm"
              title="Mois suivant"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Calendrier mobile - mois unique pour premium */}
          {monthsData.length > 0 && monthsData[currentMonthIndex] ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
              {/* En-têtes des jours de la semaine */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <div key={index} className="text-sm font-medium text-gray-500 text-center py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grille des jours du mois */}
              <div className="space-y-2">
                {monthsData[currentMonthIndex].weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-2">
                    {week.map((day, dayIndex) => {
                      const dayData = {
                        date: day.date,
                        color: day.color,
                        totalConsumptions: day.totalConsumptions,
                        hasData: day.hasData
                      } as CalendarDay;
                      
                      // Vérifier si l'utilisateur peut accéder à cette date (version mobile premium)
                      const [year, month, dayOfMonth] = day.date.split('-').map(Number);
                      const dayDate = new Date(year, month - 1, dayOfMonth);
                      const canAccess = canAccessPeriod(dayDate);
                      
                      return (
                        <button
                          key={dayIndex}
                          onClick={() => {
                            if (day.isCurrentMonth && !day.isFuture) {
                              // Toujours afficher la modale, même pour les jours bloqués
                              setSelectedDay(dayData);
                            }
                          }}
                          disabled={!day.isCurrentMonth || day.isFuture}
                          className={`
                            relative w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200
                            flex items-center justify-center
                            ${!day.isCurrentMonth 
                              ? 'text-gray-300 cursor-default'
                              : day.isFuture
                              ? 'bg-gray-200 text-gray-500 cursor-default'
                              : !canAccess
                              ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500 opacity-60 cursor-pointer'
                              : `${colorClasses[day.color]} text-white hover:scale-110 hover:shadow-lg`
                            }
                            ${day.isToday && day.isCurrentMonth 
                              ? 'ring-2 ring-gray-800' 
                              : ''
                            }
                          `}
                          title={
                            day.isCurrentMonth 
                              ? !canAccess
                                ? `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - Cliquez pour découvrir Premium et accéder à l'historique complet`
                                : `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - ${day.totalConsumptions} consommation${day.totalConsumptions > 1 ? 's' : ''}`
                              : ''
                          }
                        >
                          {day.day}
                          
                          {/* Indicateur discret pour aujourd'hui */}
                          {day.isToday && day.isCurrentMonth && (
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gray-800 rounded-full"></div>
                          )}
                          
                          {/* Indicateur pour les dates non accessibles */}
                          {!canAccess && day.isCurrentMonth && !day.isFuture && (
                            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-amber-500 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              {/* Statistiques du mois */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-light text-emerald-600">
                      {monthsData[currentMonthIndex].weeks.flat().filter(d => d.isCurrentMonth && d.color === 'green').length}
                    </div>
                    <div className="text-gray-600 font-medium">Jours calmes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-purple-600">
                      {monthsData[currentMonthIndex].weeks.flat().reduce((sum, d) => d.isCurrentMonth ? sum + d.totalConsumptions : sum, 0)}
                    </div>
                    <div className="text-gray-600 font-medium">Consommations totales</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg text-center">
              <div className="text-gray-500 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-lg font-medium">Chargement du calendrier...</p>
                <p className="text-sm text-gray-400 mt-2">
                  Préparation de votre calendrier complet
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Version desktop - calendrier classique mois par mois */}
      {hasAdvancedStats && (
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {monthsData.map((month) => (
            <div key={month.month} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-lg">
              {/* En-tête du mois */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 capitalize">
                  {month.shortName}
                </h3>
                <div className="text-sm text-gray-600">{displayYear}</div>
              </div>
              
              {/* En-têtes des jours de la semaine */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <div key={index} className="text-xs font-medium text-gray-500 text-center py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grille des jours du mois */}
              <div className="space-y-1">
                {month.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1">
                    {week.map((day, dayIndex) => {
                      const dayData = {
                        date: day.date,
                        color: day.color,
                        totalConsumptions: day.totalConsumptions,
                        hasData: day.hasData
                      } as CalendarDay;
                      
                      // Vérifier si l'utilisateur peut accéder à cette date (version premium desktop)
                      const [year, month, dayOfMonth] = day.date.split('-').map(Number);
                      const dayDate = new Date(year, month - 1, dayOfMonth);
                      const canAccess = canAccessPeriod(dayDate);
                      
                      return (
                        <button
                          key={dayIndex}
                        onClick={() => {
                          if (day.isCurrentMonth && !day.isFuture) {
                            // Toujours afficher la modale, même pour les jours bloqués
                            setSelectedDay(dayData);
                          }
                        }}
                          disabled={!day.isCurrentMonth || day.isFuture}
                          className={`
                            relative w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
                            flex items-center justify-center
                            ${!day.isCurrentMonth 
                              ? 'text-gray-300 cursor-default'
                              : day.isFuture
                              ? 'bg-gray-200 text-gray-500 cursor-default'
                              : !canAccess
                              ? 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500 opacity-60 cursor-pointer'
                              : `${colorClasses[day.color]} text-white hover:scale-110 hover:shadow-lg`
                            }
                            ${day.isToday && day.isCurrentMonth 
                              ? 'ring-2 ring-gray-800' 
                              : ''
                            }
                          `}
                          title={
                            day.isCurrentMonth 
                              ? !canAccess
                                ? `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - Cliquez pour découvrir Premium et accéder à l'historique complet`
                                : `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - ${day.totalConsumptions} consommation${day.totalConsumptions > 1 ? 's' : ''}`
                              : ''
                          }
                        >
                          {day.day}
                          
                          {/* Indicateur discret pour aujourd'hui */}
                          {day.isToday && day.isCurrentMonth && (
                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                          )}
                          
                          {/* Indicateur pour les dates non accessibles */}
                          {!canAccess && day.isCurrentMonth && !day.isFuture && (
                            <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              
              {/* Statistiques du mois */}
              <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Jours calmes</span>
                  <span className="font-medium text-emerald-600">
                    {month.weeks.flat().filter(d => d.isCurrentMonth && d.color === 'green').length}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Total</span>
                  <span className="font-medium text-purple-600">
                    {month.weeks.flat().reduce((sum, d) => d.isCurrentMonth ? sum + d.totalConsumptions : sum, 0)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      


      {/* Modal pour les détails du jour */}
      {selectedDay && (
        <CalendarDayModal
          day={selectedDay}
          dayConsumption={consumptions.find(c => c.date === selectedDay.date)}
          onClose={() => setSelectedDay(null)}
          showPaywall={(() => {
            const [year, month, dayOfMonth] = selectedDay.date.split('-').map(Number);
            const dayDate = new Date(year, month - 1, dayOfMonth);
            return !canAccessPeriod(dayDate);
          })()}
        />
      )}

      {/* Modal "Bientôt disponible" pour les utilisateurs premium simple */}
      {showComingSoonModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowComingSoonModal(false)}
          title="Fonctionnalité à venir"
          subtitle={
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-blue-500 shadow-md"></div>
              <span className="text-blue-600 text-sm font-medium">Prochaine mise à jour</span>
            </div>
          }
          size="md"
        >
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Historique étendu</h3>
            <p className="text-gray-600 mb-4">
              L'accès à l'historique de plus d'un an arrive bientôt ! 
              Nous travaillons sur cette fonctionnalité pour enrichir votre expérience.
            </p>
            <p className="text-sm text-gray-500">
              Restez connecté pour être parmi les premiers à découvrir cette nouveauté.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
