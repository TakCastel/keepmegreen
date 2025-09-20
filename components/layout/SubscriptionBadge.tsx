'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Star } from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionBadge() {
  const { subscription } = useSubscription();

  if (!subscription || subscription.plan === 'premium-plus') {
    return null;
  }

  const getBadgeInfo = () => {
    switch (subscription.plan) {
      case 'free':
        return {
          icon: Star,
          text: 'Gratuit',
          color: 'from-blue-500 to-blue-600',
          href: '/subscription',
        };
      case 'premium':
        return {
          icon: Crown,
          text: 'Premium',
          color: 'from-amber-500 to-orange-500',
          href: '/subscription',
        };
      default:
        return null;
    }
  };

  const badgeInfo = getBadgeInfo();
  if (!badgeInfo) return null;

  const Icon = badgeInfo.icon;

  return (
    <Link
      href={badgeInfo.href}
      className={`hidden sm:flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${badgeInfo.color} text-white rounded-lg text-xs font-medium transition-all hover:shadow-md`}
    >
      <Icon className="w-3 h-3" />
      <span className="hidden md:inline">{badgeInfo.text}</span>
    </Link>
  );
}
