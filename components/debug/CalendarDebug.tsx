'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAllActivities } from '@/hooks/useActivities';
import { generateCalendarData, calculateDayScore, getTotalActivities, getDayColorByScore } from '@/utils/stats';
import { format, subDays } from 'date-fns';

export default function CalendarDebug() {
  const { user } = useAuth();
  const { data: activities = [] } = useAllActivities(user?.uid);

  if (user?.email !== 'takcastel@gmail.com') {
    return null;
  }

  // Prendre les 7 derniers jours
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  });

  const debugData = last7Days.map(date => {
    const dayActivities = activities.find(a => a.date === date);
    const totalActivities = dayActivities ? getTotalActivities(dayActivities) : 0;
    const positiveScore = dayActivities ? calculateDayScore(dayActivities) : 0;
    const dayColor = dayActivities ? getDayColorByScore(positiveScore) : 'neutral';
    
    return {
      date,
      dayActivities,
      totalActivities,
      positiveScore,
      dayColor,
      hasData: !!dayActivities
    };
  });

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 m-4">
      <h3 className="text-lg font-bold text-yellow-800 mb-4">🐛 Debug Calendrier (takcastel@gmail.com)</h3>
      
      <div className="space-y-3">
        {debugData.map(({ date, dayActivities, totalActivities, positiveScore, dayColor, hasData }) => (
          <div key={date} className="bg-white rounded-lg p-3 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">{date}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                dayColor === 'neutral' ? 'bg-gray-100 text-gray-600' :
                dayColor === 'light-blue' ? 'bg-blue-100 text-blue-600' :
                dayColor === 'blue' ? 'bg-blue-200 text-blue-700' :
                dayColor === 'dark-blue' ? 'bg-blue-300 text-blue-800' :
                'bg-purple-200 text-purple-800'
              }`}>
                {dayColor}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Activités:</span> 
                <span className="font-medium ml-1">{totalActivities}</span>
              </div>
              <div>
                <span className="text-gray-600">Score:</span> 
                <span className="font-medium ml-1">{positiveScore.toFixed(1)}</span>
              </div>
            </div>
            
            {hasData && dayActivities && (
              <div className="mt-2 text-xs text-gray-600">
                <div>Sport: {dayActivities.sport?.length || 0}</div>
                <div>Social: {dayActivities.social?.length || 0}</div>
                <div>Nutrition: {dayActivities.nutrition?.length || 0}</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-yellow-700">
        <p>Total activités trouvées: {activities.length}</p>
        <p>Période: {activities.length > 0 ? `${activities[activities.length - 1]?.date} à ${activities[0]?.date}` : 'Aucune'}</p>
      </div>
    </div>
  );
}
