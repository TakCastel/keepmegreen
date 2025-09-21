'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ActivityEditor from '@/components/settings/ActivityEditor';
import AccountSettings from '@/components/settings/AccountSettings';
import PremiumFeatures from '@/components/settings/PremiumFeatures';
import TestDataGenerator from '@/components/settings/TestDataGenerator';
import { Edit3, User, Settings as SettingsIcon, Lightbulb, Shield, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'consumption' | 'account' | 'legal'>('consumption');
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
    },
    {
      id: 'legal' as const,
      label: 'Informations légales',
      icon: Shield,
      description: 'Disclaimers, confidentialité et ressources de santé'
    }
  ];

  return (
    <div className="space-y-10">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="hidden md:flex w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl items-center justify-center shadow-lg">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-light text-gray-800">
            <span className="md:hidden">{tabs.find(tab => tab.id === activeTab)?.label || 'Paramètres'}</span>
            <span className="hidden md:inline">Paramètres</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base">
          Gérez vos données et préférences de compte
        </p>
      </div>

      {/* Onglets */}
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl border border-white/20">
        <div className="flex flex-row justify-center gap-2 md:gap-4 mb-6 md:mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 md:gap-4 px-3 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg'
                    : 'bg-white/70 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200'
                }`}
                title={tab.label}
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                <div className="text-left hidden md:block">
                  <div className="font-medium text-sm md:text-base">{tab.label}</div>
                  <div className="text-xs opacity-80">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Contenu des onglets */}
        <div className="border-t border-gray-200 pt-6 md:pt-8">
          {activeTab === 'consumption' && <ActivityEditor presetDate={presetDate || undefined} />}
          {activeTab === 'account' && <AccountSettings />}
          {activeTab === 'legal' && (
            <div className="space-y-8">
              {/* Disclaimers médicaux */}
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Disclaimer médical
                </h3>
                <div className="space-y-3 text-red-700">
                  <p>
                    <strong>Important :</strong> Cette application ne remplace en aucun cas un suivi médical professionnel. 
                    Elle sert uniquement à prendre conscience de vos habitudes personnelles.
                  </p>
                  <p>
                    Pour toute question concernant votre santé, consultez un professionnel de santé qualifié.
                  </p>
                </div>
              </div>

              {/* Ressources gouvernementales */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Ressources officielles de santé
                </h3>
                <div className="space-y-4">
                  {/* Tabagisme */}
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Arrêt du tabac</h4>
                    <div className="space-y-2 text-sm">
                      <a 
                        href="https://www.tabac-info-service.fr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Tabac Info Service - 39 89
                      </a>
                      <a 
                        href="https://www.ameli.fr/assure/sante/themes/tabac/evaluer-consommation-motivation" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ameli.fr - Évaluer sa consommation et motivation
                      </a>
                    </div>
                  </div>

                  {/* Alcool */}
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Consommation d'alcool</h4>
                    <div className="space-y-2 text-sm">
                      <a 
                        href="https://www.alcool-info-service.fr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Alcool Info Service - 0 980 980 930
                      </a>
                      <a 
                        href="https://www.sante.gouv.fr/prevention-en-sante/addictions/article/politique-de-sante-publique-en-matiere-de-consommation-d-alcool" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ministère de la Santé - Prévention alcool
                      </a>
                    </div>
                  </div>

                  {/* Nutrition */}
                  <div className="bg-white rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Nutrition et alimentation</h4>
                    <div className="space-y-2 text-sm">
                      <a 
                        href="https://www.mangerbouger.fr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Manger Bouger - Programme National Nutrition Santé
                      </a>
                      <a 
                        href="https://www.anses.fr" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        ANSES - Agence nationale de sécurité sanitaire
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confidentialité */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Confidentialité et données
                </h3>
                <div className="space-y-3 text-green-700">
                  <p>
                    <strong>Protection des données :</strong> Vos informations sont stockées de manière sécurisée 
                    et ne sont jamais partagées avec des tiers.
                  </p>
                  <p>
                    <strong>Usage personnel :</strong> Cette application est conçue pour un usage strictement personnel. 
                    Aucun jugement n'est porté sur vos choix.
                  </p>
                  <p>
                    <strong>Contrôle :</strong> Vous pouvez supprimer votre compte et toutes vos données à tout moment 
                    depuis les paramètres de votre compte.
                  </p>
                </div>
              </div>

              {/* Mentions légales */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Documents légaux
                </h3>
                <div className="space-y-4">
                  <div className="space-y-3 text-gray-700 text-sm">
                    <p>
                      <strong>Éditeur :</strong> GrowDaily - Application de suivi personnel
                    </p>
                    <p>
                      <strong>Finalité :</strong> Outil de prise de conscience personnelle des habitudes de consommation
                    </p>
                    <p>
                      <strong>Données collectées :</strong> Informations de consommation personnelles (alcool, cigarettes, nutrition)
                    </p>
                    <p>
                      <strong>Base légale :</strong> Consentement explicite de l'utilisateur
                    </p>
                    <p>
                      <strong>Durée de conservation :</strong> Jusqu'à suppression du compte par l'utilisateur
                    </p>
                  </div>
                  
                  {/* Liens vers les pages complètes */}
                  <div className="pt-4 border-t border-gray-300">
                    <p className="text-sm font-medium text-gray-600 mb-3">Documents complets :</p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="/mentions-legales"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm border border-gray-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Mentions légales
                      </a>
                      <a
                        href="/politique-confidentialite"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm border border-gray-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Politique de confidentialité
                      </a>
                      <a
                        href="/cgu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm border border-gray-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                        CGU
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fonctionnalités Premium */}
      <PremiumFeatures />

      {/* Générateur de données de test */}
      <TestDataGenerator />

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
          ) : activeTab === 'account' ? (
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
          ) : (
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Consultez les ressources gouvernementales pour obtenir de l&apos;aide professionnelle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Cette application ne remplace pas un suivi médical</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Vos données sont protégées et ne sont jamais partagées</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-500 mt-1">•</span>
                <span>Vous pouvez supprimer votre compte à tout moment</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
