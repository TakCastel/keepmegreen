'use client';

import { 
  // Icônes de base
  Beer, Wine, Coffee, CupSoda, Martini, 
  Cigarette, Scissors, Waves, Zap,
  Beef, Pizza, Utensils, Candy,
  Sprout, Settings, Calendar, BarChart3, History,
  Flower2, Leaf, Sun, Sunrise, Search, Lightbulb,
  
  // Activités sportives
  Dumbbell, Flower, Bike, Footprints, Music, Mountain, Circle, CircleDot,
  
  // Activités sociales
  Users, Heart, HandHeart, Palette, PartyPopper, Users2,
  
  // Nutrition
  Apple, Droplets, ChefHat, Cookie, Moon,
  
  // Alcool
  Wine as Glass, // Utiliser Wine comme alternative pour Glass
  
  // Malbouffe
  Hamburger, IceCream, Donut, Cake,
  
  // Icônes de remplacement
  Package, Square, Circle as CircleIcon,
  
  LucideIcon
} from 'lucide-react';

// Map des icônes disponibles
const iconMap: Record<string, LucideIcon> = {
  // Icônes de base
  Beer, Wine, Coffee, CupSoda, Martini, 
  Cigarette, Scissors, Waves, Zap,
  Beef, Pizza, Utensils, Candy,
  Sprout, Settings, Calendar, BarChart3, History,
  Flower2, Leaf, Sun, Sunrise, Search, Lightbulb,
  
  // Activités sportives
  Dumbbell, Flower, Bike, Footprints, Music, Mountain, Circle, CircleDot,
  
  // Activités sociales
  Users, Heart, HandHeart, Palette, PartyPopper, Users2,
  
  // Nutrition
  Apple, Droplets, ChefHat, Cookie, Moon,
  
  // Alcool - utiliser Wine comme alternative pour Glass
  Glass,
  
  // Cigarettes - utiliser Cigarette pour toutes les variantes
  Cigar: Cigarette,
  Pipe: Cigarette,
  Vape: Cigarette,
  Shisha: Cigarette,
  
  // Malbouffe - utiliser Package pour les icônes manquantes
  Hamburger, IceCream, Donut, Cake,
  Fries: Package,
  Soda: Package,
  Chips: Package,
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
