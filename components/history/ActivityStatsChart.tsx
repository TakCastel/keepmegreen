'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { DayActivities } from '@/types';
import { getAggregatedStats } from '@/utils/stats';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ActivityStatsChartProps {
  activities: DayActivities[];
  type: 'weekly' | 'monthly';
}

export default function ActivityStatsChart({ activities, type }: ActivityStatsChartProps) {
  const stats = getAggregatedStats(activities);

  // Configuration pour le graphique en barres (évolution temporelle)
  const timeLabels = activities
    .slice(0, 10) // Limiter à 10 derniers points
    .reverse()
    .map(a => {
      const date = new Date(a.date);
      return type === 'weekly' 
        ? date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    });

  const barData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Sport',
        data: activities.slice(0, 10).reverse().map(a => 
          a.sport.reduce((sum, item) => sum + item.quantity, 0)
        ),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Social',
        data: activities.slice(0, 10).reverse().map(a => 
          a.social.reduce((sum, item) => sum + item.quantity, 0)
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Nutrition',
        data: activities.slice(0, 10).reverse().map(a => 
          a.nutrition.reduce((sum, item) => sum + item.quantity, 0)
        ),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
        borderColor: 'rgb(168, 85, 247)',
        borderWidth: 1,
      },
    ],
  };

  // Configuration pour le graphique en camembert (répartition par catégorie)
  const doughnutData = {
    labels: ['Sport', 'Social', 'Nutrition'],
    datasets: [
      {
        data: [stats.sport.total, stats.social.total, stats.nutrition.total],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: 500,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: `Évolution ${type === 'weekly' ? 'hebdomadaire' : 'mensuelle'}`,
        color: '#1f2937',
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 300,
        },
        padding: 20,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.3)',
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(209, 213, 219, 0.3)',
          drawBorder: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: 500,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'Répartition par catégorie',
        color: '#1f2937',
        font: {
          family: 'Inter, sans-serif',
          size: 16,
          weight: 300,
        },
        padding: 20,
      },
    },
    cutout: '60%',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Graphique en barres */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <Bar data={barData} options={chartOptions} />
      </div>

      {/* Graphique en camembert */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <Doughnut data={doughnutData} options={doughnutOptions} />
      </div>
    </div>
  );
}
