'use client';

import { 
  Beer, Wine, Coffee, CupSoda, Martini, 
  Cigarette, Scissors, Waves, Zap,
  Beef, Pizza, Utensils, Candy,
  Sprout, Settings, Calendar, BarChart3, History,
  Flower2, Leaf, Sun, Sunrise, Search, Lightbulb,
  LucideIcon
} from 'lucide-react';

// Map des icônes disponibles
const iconMap: Record<string, LucideIcon> = {
  Beer,
  Wine,
  Coffee,
  CupSoda,
  Martini,
  Cigarette,
  Scissors,
  Waves,
  Zap,
  Beef,
  Pizza,
  Utensils,
  Candy,
  Sprout,
  Settings,
  Calendar,
  BarChart3,
  History,
  Flower2,
  Leaf,
  Sun,
  Sunrise,
  Search,
  Lightbulb,
};

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ name, className = "", size = 16 }: DynamicIconProps) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return <div className={`w-4 h-4 bg-gray-300 rounded ${className}`} />;
  }
  
  return <IconComponent className={className} size={size} />;
}
