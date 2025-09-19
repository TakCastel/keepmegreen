'use client';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton = ({ className = '', children }: SkeletonProps) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
      {children}
    </div>
  );
};

// Composants skeleton spécialisés
export const CardSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-2xl mb-4 w-3/4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded-2xl"></div>
      <div className="h-4 bg-gray-200 rounded-2xl w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded-2xl w-4/5"></div>
    </div>
  </div>
);

export const StatsCardSkeleton = () => (
  <div className="bg-white/70 rounded-3xl p-6 animate-pulse border border-gray-200">
    <div className="h-16 bg-gray-200 rounded-2xl mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white/70 rounded-3xl p-8 border border-gray-200 animate-pulse">
    <div className="h-8 bg-gray-200 rounded-2xl w-64 mx-auto mb-6"></div>
    <div className="h-64 bg-gray-200 rounded-2xl"></div>
  </div>
);

export const CalendarSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="flex items-center justify-between">
      <div className="h-8 bg-gray-200 rounded-2xl w-32"></div>
      <div className="h-12 bg-gray-200 rounded-2xl w-24"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white/80 rounded-2xl p-4 border border-gray-200">
          <div className="h-6 bg-gray-200 rounded-2xl mb-4"></div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, k) => (
              <div key={k} className="grid grid-cols-7 gap-1">
                {Array.from({ length: 7 }).map((_, l) => (
                  <div key={l} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ButtonSkeleton = () => (
  <div className="h-12 bg-gray-200 rounded-2xl animate-pulse"></div>
);

export const TableSkeleton = () => (
  <div className="bg-white/70 rounded-3xl p-8 border border-gray-200 animate-pulse">
    <div className="h-6 bg-gray-200 rounded-2xl mb-6 w-1/3"></div>
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

export const PageHeaderSkeleton = () => (
  <div className="text-center animate-pulse">
    <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
      <div className="hidden md:flex w-16 h-16 bg-gray-200 rounded-3xl"></div>
      <div className="h-8 bg-gray-200 rounded-2xl w-96"></div>
    </div>
    <div className="h-6 bg-gray-200 rounded-2xl w-2/3 mx-auto"></div>
  </div>
);

export const ConsumptionButtonSkeleton = () => (
  <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 animate-pulse">
    <div className="h-16 bg-gray-200 rounded-2xl mb-6"></div>
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-2xl"></div>
      ))}
    </div>
  </div>
);

export default Skeleton;
