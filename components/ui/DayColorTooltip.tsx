'use client';

import { DayColor } from '@/types';

interface DayColorInfoProps {
  color: DayColor;
  colorBg: string;
}

const DayColorInfo = ({ color, colorBg }: DayColorInfoProps) => {
  const colorInfo = {
    green: {
      title: 'Sérénité',
      advice: 'Continuez sur cette voie ! Votre équilibre est exemplaire.',
      range: '0-1.9 points'
    },
    yellow: {
      title: 'Éveil',
      advice: 'Restez vigilant·e pour ne pas accumuler davantage. Privilégiez des alternatives saines.',
      range: '2-4 points'
    },
    orange: {
      title: 'Vigilance',
      advice: 'Moment idéal pour faire une pause et pratiquer la pleine conscience. Évitez d\'ajouter d\'autres consommations.',
      range: '4.1-8 points'
    },
    red: {
      title: 'Attention',
      advice: 'Soyez bienveillant·e avec vous-même. Demain est une nouvelle opportunité. Concentrez-vous sur le repos et la récupération.',
      range: '8+ points'
    }
  };

  const currentInfo = colorInfo[color];

  return (
    <div className="flex items-start gap-3">
      {/* Pastille de couleur */}
      <div className={`w-6 h-6 rounded-full ${colorBg} shadow-md flex-shrink-0 mt-1`}></div>
      
      {/* Informations textuelles */}
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-800 mb-1">
          {currentInfo.title}
        </div>
        <div className="text-xs text-gray-600 leading-relaxed mb-2">
          {currentInfo.advice}
        </div>
        <div className="text-xs text-gray-500">
          Pondération : {currentInfo.range}
        </div>
      </div>
    </div>
  );
};

export default DayColorInfo;
