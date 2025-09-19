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
import { DayConsumption } from '@/types';
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

interface StatsChartProps {
  consumptions: DayConsumption[];
  type: 'weekly' | 'monthly';
}

export default function StatsChart({ consumptions, type }: StatsChartProps) {
  const stats = getAggregatedStats(consumptions);

  // Configuration pour le graphique en barres (évolution temporelle)
  const timeLabels = consumptions
    .slice(0, 10) // Limiter à 10 derniers points
    .reverse()
    .map(c => {
      const date = new Date(c.date);
      return type === 'weekly' 
        ? date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    });

  // const timeData = consumptions
  //   .slice(0, 10)
  //   .reverse()
  //   .map(c => stats.alcohol.total + stats.cigarettes.total + stats.junkfood.total);

  const barData = {
    labels: timeLabels,
    datasets: [
      {
        label: 'Alcool',
        data: consumptions.slice(0, 10).reverse().map(c => 
          c.alcohol.reduce((sum, item) => sum + item.quantity, 0)
        ),
        backgroundColor: 'rgba(147, 51, 234, 0.7)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
      {
        label: 'Cigarettes',
        data: consumptions.slice(0, 10).reverse().map(c => 
          c.cigarettes.reduce((sum, item) => sum + item.quantity, 0)
        ),
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
        borderColor: 'rgba(249, 115, 22, 1)',
        borderWidth: 1,
      },
      {
        label: 'Malbouffe',
        data: consumptions.slice(0, 10).reverse().map(c => 
          c.junkfood.reduce((sum, item) => sum + item.quantity, 0)
        ),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Configuration pour le graphique en camembert (répartition par catégorie)
  const doughnutData = {
    labels: ['Alcool', 'Cigarettes', 'Malbouffe'],
    datasets: [
      {
        data: [stats.alcohol.total, stats.cigarettes.total, stats.junkfood.total],
        backgroundColor: [
          'rgba(147, 51, 234, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
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
