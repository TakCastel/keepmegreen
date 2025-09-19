'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ConsumptionEditor from '@/components/settings/ConsumptionEditor';
import AccountSettings from '@/components/settings/AccountSettings';
import { Edit3, User, Settings as SettingsIcon, Lightbulb } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'consumption' | 'account'>('consumption');
  const searchParams = useSearchParams();
  const presetDate = searchParams.get('date');

  // Si une date est fournie en paramètre, s'assurer que l'onglet consommation est actif
  useEffect(() => {
    if (presetDate) {
      setActiveTab('consumption');
    }
  }, [presetDate]);

  const tabs = [
    {
      id: 'consumption' as const,
      label: 'Modifier les consommations',
      icon: Edit3,
      description: 'Gérez et modifiez vos consommations enregistrées'
    },
    {
      id: 'account' as const,
      label: 'Compte utilisateur',
      icon: User,
      description: 'Paramètres de votre compte et informations personnelles'
    }
  ];

  return (
    <div className="space-y-10">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
          <div className="hidden md:flex w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-3xl items-center justify-center shadow-xl">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-4xl font-light text-gray-800">
            Paramètres
          </h1>
        </div>
        <p className="text-gray-600 text-base md:text-lg">
          Gérez vos données et préférences de compte
        </p>
      </div>

      {/* Onglets */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg'
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                }`}
              >
                <Icon className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs opacity-80">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Contenu des onglets */}
        <div className="border-t border-gray-200 pt-8">
          {activeTab === 'consumption' && <ConsumptionEditor presetDate={presetDate || undefined} />}
          {activeTab === 'account' && <AccountSettings />}
        </div>
      </div>

      {/* Aide */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-3xl p-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-medium text-slate-700">Aide</h3>
        </div>
        <div className="text-gray-700">
          {activeTab === 'consumption' ? (
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Utilisez les filtres pour trouver rapidement des consommations spécifiques</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Cliquez sur l&apos;icône poubelle pour supprimer une unité de consommation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>La suppression est définitive, soyez prudent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Les modifications sont synchronisées automatiquement</span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Votre nom d&apos;affichage apparaît dans l&apos;interface</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>L&apos;email ne peut pas être modifié après la création du compte</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>La suppression du compte est définitive et irréversible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Toutes vos données seront perdues lors de la suppression</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
