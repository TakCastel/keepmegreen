'use client';

import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-light text-gray-800">
              Mentions <span className="font-semibold text-emerald-600">légales</span>
            </h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg">
            Informations légales et réglementaires concernant DrinkeatGreen
          </p>
        </div>

        {/* Bouton retour */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white text-gray-700 rounded-xl transition-all shadow-md hover:shadow-lg border border-gray-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Contenu */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="space-y-8">
            {/* Éditeur */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Éditeur du site</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Nom :</strong> DrinkeatGreen</p>
                  <p><strong>Type :</strong> Application web de suivi personnel</p>
                  <p><strong>Finalité :</strong> Outil de prise de conscience des habitudes de consommation</p>
                  <p><strong>Contact :</strong> Disponible via les paramètres de l'application</p>
                </div>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Hébergement</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Hébergeur :</strong> Firebase Hosting (Google Cloud Platform)</p>
                  <p><strong>Adresse :</strong> Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis</p>
                  <p><strong>Services utilisés :</strong> Firebase Hosting, Firestore Database, Firebase Authentication</p>
                  <p><strong>Stockage des données :</strong> Données chiffrées et sécurisées sur les serveurs Google</p>
                </div>
              </div>
            </section>

            {/* Données personnelles */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Données personnelles</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold mb-2">Données collectées :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Informations de compte (email, nom d'affichage)</li>
                      <li>Données de consommation personnelles (alcool, cigarettes, nutrition)</li>
                      <li>Dates et quantités des consommations</li>
                      <li>Statistiques et métriques de suivi</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Finalité du traitement :</h3>
                    <p>Prise de conscience personnelle et suivi des habitudes de consommation</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Base légale :</h3>
                    <p>Consentement explicite de l'utilisateur</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Durée de conservation :</h3>
                    <p>Jusqu'à suppression du compte par l'utilisateur</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Droits des utilisateurs */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Droits des utilisateurs</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Droit d'accès :</strong> Consulter vos données personnelles</li>
                    <li><strong>Droit de rectification :</strong> Corriger vos informations</li>
                    <li><strong>Droit à l'effacement :</strong> Supprimer votre compte et vos données</li>
                    <li><strong>Droit à la portabilité :</strong> Récupérer vos données</li>
                    <li><strong>Droit d'opposition :</strong> Vous opposer au traitement</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    Pour exercer ces droits, utilisez les paramètres de votre compte ou contactez-nous.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Cookies et technologies</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p>L'application utilise les technologies suivantes :</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Cookies de session :</strong> Pour maintenir votre connexion</li>
                    <li><strong>Local Storage :</strong> Pour sauvegarder vos préférences</li>
                    <li><strong>Firebase Authentication :</strong> Pour la sécurité des comptes</li>
                    <li><strong>Firestore :</strong> Pour le stockage des données</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Limitation de responsabilité</h2>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <div className="space-y-3 text-red-700">
                  <p><strong>Important :</strong> Cette application ne remplace pas un suivi médical professionnel.</p>
                  <p>L'éditeur ne peut être tenu responsable :</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Des décisions prises sur la base des données de l'application</li>
                    <li>De l'interprétation des statistiques et métriques</li>
                    <li>Des conséquences de l'utilisation des données personnelles</li>
                    <li>Des interruptions temporaires du service</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Propriété intellectuelle</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p>Tous les éléments de l'application (design, code, contenu) sont protégés par le droit d'auteur.</p>
                  <p>L'utilisation de l'application ne confère aucun droit de propriété sur ces éléments.</p>
                  <p>Les données personnelles de l'utilisateur restent sa propriété exclusive.</p>
                </div>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Droit applicable</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Loi applicable :</strong> Droit français</p>
                  <p><strong>Juridiction compétente :</strong> Tribunaux français</p>
                  <p><strong>Réglementation :</strong> RGPD (Règlement Général sur la Protection des Données)</p>
                  <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
