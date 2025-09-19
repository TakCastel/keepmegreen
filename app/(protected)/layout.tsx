import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navbar from '@/components/layout/Navbar';
import DataPrefetcher from '@/components/providers/DataPrefetcher';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <DataPrefetcher />
      <div className="min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* Éléments décoratifs subtils */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-green-300/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-mint/10 to-sage-green/5 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
