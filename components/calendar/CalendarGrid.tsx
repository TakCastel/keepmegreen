'use client';

import React from 'react';
import { useCalendarGrid } from '@/hooks/useCalendarGrid';
import { useCalendarModal } from '@/contexts/CalendarModalContext';
import { CalendarSkeleton, FreeCalendarSkeleton, PremiumCalendarSkeleton } from '@/components/ui/Skeleton';
import Paywall from '@/components/subscription/Paywall';
import Modal from '@/components/ui/Modal';
import CalendarControls from './CalendarControls';
import CalendarNavigation from './CalendarNavigation';
import CalendarMonth from './CalendarMonth';
import CalendarGridMulti from './CalendarGridMulti';
import { CalendarDay as CalendarDayType } from '@/types';

export default function CalendarGrid() {
  const { openModal } = useCalendarModal();
  const {
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
  } = useCalendarGrid();

  // Afficher un skeleton uniquement pendant le chargement d'auth
  if (loading) {
    return <CalendarSkeleton />;
  }

  // Afficher le skeleton adapté selon le plan si les données sont en cours de chargement
  if (!user || activitiesLoading) {
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

  const handleDayClick = (dayData: CalendarDayType, dayActivities: any, showPaywall: boolean) => {
    openModal(dayData, null, dayActivities, showPaywall);
  };

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <CalendarControls
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        hasAdvancedStats={hasAdvancedStats}
        displayYear={displayYear}
        setShowYearPaywall={setShowYearPaywall}
        activeDaysPercentage={activeDaysPercentage}
      />

      {/* Calendrier gratuit - version desktop */}
      {!hasAdvancedStats && (
        <div className="hidden md:flex justify-center">
          <div className="inline-block">
            {monthsData.map((month) => (
              <CalendarMonth
                key={month.month}
                month={month}
                displayYear={displayYear}
                canAccessPeriod={canAccessPeriod}
                onDayClick={handleDayClick}
                activities={activities}
                size="large"
                showStats={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Version mobile avec pagination - seulement pour les utilisateurs gratuits */}
      {!hasAdvancedStats && (
        <div className="md:hidden">
          {/* En-tête simple pour les utilisateurs freemium */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 capitalize">
              {monthsData[currentMonthIndex]?.name || 'Chargement...'}
            </h3>
          </div>

          {/* Calendrier mobile - mois unique */}
          {monthsData.length > 0 && monthsData[currentMonthIndex] ? (
            <CalendarMonth
              month={monthsData[currentMonthIndex]}
              displayYear={displayYear}
              canAccessPeriod={canAccessPeriod}
              onDayClick={handleDayClick}
              activities={activities}
              size="medium"
              showStats={true}
            />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg text-center">
              <div className="text-gray-500 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-lg font-medium">Chargement du calendrier...</p>
                <p className="text-sm text-gray-400 mt-2">
                  Préparation de votre calendrier du mois
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
          <CalendarNavigation
            currentMonthIndex={currentMonthIndex}
            monthsData={monthsData}
            hasAdvancedStats={hasAdvancedStats}
            maxMonths={maxMonths}
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
            goToCurrentMonth={goToCurrentMonth}
          />

          {/* Calendrier mobile - mois unique pour premium */}
          {monthsData.length > 0 && monthsData[currentMonthIndex] ? (
            <CalendarMonth
              month={monthsData[currentMonthIndex]}
              displayYear={displayYear}
              canAccessPeriod={canAccessPeriod}
              onDayClick={handleDayClick}
              activities={activities}
              size="medium"
              showStats={true}
            />
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

      {/* Version desktop - calendrier carousel avec plusieurs mois visibles */}
      {hasAdvancedStats && (
        <div className="hidden md:block">
          {/* Navigation desktop */}
          <CalendarNavigation
            currentMonthIndex={currentMonthIndex}
            monthsData={monthsData}
            hasAdvancedStats={hasAdvancedStats}
            maxMonths={maxMonths}
            goToPreviousMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
            goToCurrentMonth={goToCurrentMonth}
          />

          {/* Grille des calendriers selon la taille d'écran */}
          <CalendarGridMulti
            monthsData={monthsData}
            currentMonthIndex={currentMonthIndex}
            maxMonths={maxMonths}
            screenSize={screenSize}
            displayYear={displayYear}
            canAccessPeriod={canAccessPeriod}
            onDayClick={handleDayClick}
            activities={activities}
          />
        </div>
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

      {/* Modal de paywall pour le changement d'année */}
      <Modal
        isOpen={showYearPaywall}
        onClose={() => setShowYearPaywall(false)}
        title="Calendrier Complet"
        subtitle={
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-amber-500 shadow-md"></div>
            <span className="text-amber-600 text-sm font-medium">Fonctionnalité Premium</span>
          </div>
        }
        size="lg"
      >
        <Paywall 
          feature="fullCalendar"
          title="Calendrier Complet"
          description="Accédez à plusieurs années et naviguez dans votre historique complet."
          compact={true}
          onUpgrade={() => {
            window.location.href = '/subscription';
            setShowYearPaywall(false);
          }}
        />
      </Modal>
    </div>
  );
}
