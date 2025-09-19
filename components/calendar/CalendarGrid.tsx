'use client';

import { useState } from 'react';
import { format, startOfYear, endOfYear, eachWeekOfInterval, startOfWeek, eachDayOfInterval, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAllConsumptions } from '@/hooks/useConsumptions';
import { useAuth } from '@/hooks/useAuth';
import { generateCalendarData, getGreenDaysPercentage } from '@/utils/stats';
import { CalendarDay } from '@/types';
import CalendarDayModal from './CalendarDayModal';
import { Flower, BarChart3, User } from 'lucide-react';

export default function CalendarGrid() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  
  const { data: consumptions = [], isLoading } = useAllConsumptions(user?.uid);

  // Générer les données du calendrier pour l'année sélectionnée
  const startDate = startOfYear(new Date(selectedYear, 0, 1));
  const endDate = endOfYear(new Date(selectedYear, 0, 1));
  const calendarDays = generateCalendarData(consumptions, startDate, endDate);
  
  // Générer les données pour chaque mois
  const monthsData = [];
  for (let month = 0; month < 12; month++) {
    const monthStart = new Date(selectedYear, month, 1);
    const monthEnd = new Date(selectedYear, month + 1, 0); // Dernier jour du mois
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

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded-2xl w-48"></div>
        <div className="grid grid-cols-53 gap-1">
          {Array.from({ length: 371 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-white/70 text-gray-800 rounded-2xl px-4 py-3 border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-md backdrop-blur-sm"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="text-right bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="text-3xl font-light text-emerald-700">{greenDaysPercentage}%</div>
          <div className="text-sm text-emerald-600 font-medium">de sérénité</div>
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-600 bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
        <span className="font-medium">Moins</span>
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-md shadow-sm"></div>
          <div className="w-4 h-4 bg-amber-400 rounded-md shadow-sm"></div>
          <div className="w-4 h-4 bg-orange-400 rounded-md shadow-sm"></div>
          <div className="w-4 h-4 bg-rose-400 rounded-md shadow-sm"></div>
        </div>
        <span className="font-medium">Plus</span>
      </div>

      {/* Calendrier classique mois par mois */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {monthsData.map((month) => (
          <div key={month.month} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 shadow-lg">
            
            {/* En-tête du mois */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {month.shortName}
              </h3>
              <div className="text-sm text-gray-600">{selectedYear}</div>
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
                    
                    return (
                      <button
                        key={dayIndex}
                        onClick={() => day.isCurrentMonth && !day.isFuture ? setSelectedDay(dayData) : null}
                        disabled={!day.isCurrentMonth || day.isFuture}
                        className={`
                          relative w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200
                          flex items-center justify-center
                          ${!day.isCurrentMonth 
                            ? 'text-gray-300 cursor-default'
                            : day.isFuture
                            ? 'bg-gray-200 text-gray-500 cursor-default'
                            : `${colorClasses[day.color]} text-white hover:scale-110 hover:shadow-lg`
                          }
                          ${day.isToday && day.isCurrentMonth 
                            ? 'ring-2 ring-gray-800' 
                            : ''
                          }
                        `}
                        title={
                          day.isCurrentMonth 
                            ? `${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - ${day.totalConsumptions} consommation${day.totalConsumptions > 1 ? 's' : ''}`
                            : ''
                        }
                      >
                        {day.day}
                        
                        {/* Indicateur discret pour aujourd'hui */}
                        {day.isToday && day.isCurrentMonth && (
                          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
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
                <span>Jours sereins</span>
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
      
      {/* Légende centralisée */}
      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">Légende</h3>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-lg shadow-sm"></div>
            <span className="text-gray-700 font-medium">Sérénité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-400 rounded-lg shadow-sm"></div>
            <span className="text-gray-700 font-medium">Éveil</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-400 rounded-lg shadow-sm"></div>
            <span className="text-gray-700 font-medium">Vigilance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-400 rounded-lg shadow-sm"></div>
            <span className="text-gray-700 font-medium">Attention</span>
          </div>
        </div>
      </div>

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        <div className="bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <Flower className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-light text-emerald-700 mb-1">{calendarDays.filter(d => d.color === 'green').length}</div>
          <div className="text-emerald-600 font-medium">Jours sereins</div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-light text-blue-700 mb-1">{calendarDays.filter(d => d.hasData).length}</div>
          <div className="text-blue-600 font-medium">Jours conscients</div>
        </div>
        <div className="bg-purple-50 rounded-2xl p-6 text-center border border-purple-100">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-light text-purple-700 mb-1">
            {calendarDays.reduce((sum, day) => sum + day.totalConsumptions, 0)}
          </div>
          <div className="text-purple-600 font-medium">Prises de conscience</div>
        </div>
      </div>

      {/* Modal pour les détails du jour */}
      {selectedDay && (
        <CalendarDayModal
          day={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}
