'use client';

import { useState } from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
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
  
  // Organiser les jours par semaines
  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];
  
  // Commencer par la première semaine (peut ne pas être complète)
  const firstDay = calendarDays[0];
  if (firstDay) {
    const firstDayDate = new Date(firstDay.date);
    const weekStart = startOfWeek(firstDayDate, { weekStartsOn: 1 }); // Lundi = 1
    const weekEnd = endOfWeek(firstDayDate, { weekStartsOn: 1 });
    
    // Remplir les jours avant le début de l'année
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    weekDays.forEach(date => {
      const dateString = format(date, 'yyyy-MM-dd');
      const dayData = calendarDays.find(d => d.date === dateString);
      
      if (dayData) {
        currentWeek.push(dayData);
      } else if (date < startDate || date > endDate) {
        // Jour en dehors de l'année sélectionnée
        currentWeek.push({
          date: dateString,
          color: 'green',
          totalConsumptions: 0,
          hasData: false,
        });
      }
    });
    
    weeks.push([...currentWeek]);
    currentWeek = [];
  }
  
  // Organiser le reste des jours par semaines de 7 jours
  for (let i = 7; i < calendarDays.length; i += 7) {
    const week = calendarDays.slice(i, i + 7);
    if (week.length > 0) {
      weeks.push(week);
    }
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

      {/* Étiquettes des mois */}
      <div className="text-xs text-gray-600 grid grid-cols-12 gap-4 mb-4 font-medium">
        {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'].map(month => (
          <span key={month}>{month}</span>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="overflow-x-auto">
        <div className="grid gap-1 min-w-[800px]" style={{ gridTemplateColumns: `repeat(53, minmax(0, 1fr))` }}>
          {/* Étiquettes des jours de la semaine */}
          <div className="text-xs text-gray-600 col-span-53 grid grid-cols-53 gap-1 mb-3 font-medium">
            <span></span>
            <span>Lun</span>
            <span></span>
            <span>Mer</span>
            <span></span>
            <span>Ven</span>
            <span></span>
          </div>

          {/* Jours du calendrier */}
          {calendarDays.map((day, index) => {
            const isToday = day.date === format(new Date(), 'yyyy-MM-dd');
            
            return (
              <button
                key={day.date}
                onClick={() => setSelectedDay(day)}
                className={`
                  w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 hover:ring-2 hover:ring-white/50
                  ${colorClasses[day.color]}
                  ${isToday ? 'ring-2 ring-white' : ''}
                `}
                title={`${format(new Date(day.date), 'dd MMMM yyyy', { locale: fr })} - ${day.totalConsumptions} consommation${day.totalConsumptions > 1 ? 's' : ''}`}
              />
            );
          })}
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
