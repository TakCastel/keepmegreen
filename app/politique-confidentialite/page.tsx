'use client';

import { Shield, ArrowLeft, Lock, Eye, Database, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-light text-gray-800">
              Politique de <span className="font-semibold text-emerald-600">confidentialité</span>
            </h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg">
            Comment nous protégeons et utilisons vos données personnelles
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
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-600" />
                Notre engagement
              </h2>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <div className="space-y-3 text-emerald-700">
                  <p>
                    <strong>DrinkeatGreen</strong> s'engage à protéger votre vie privée et vos données personnelles. 
                    Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
                  </p>
                  <p>
                    Nous respectons votre confidentialité et nous nous conformons au RGPD (Règlement Général 
                    sur la Protection des Données) et aux lois françaises applicables.
                  </p>
                </div>
              </div>
            </section>

            {/* Données collectées */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                Données que nous collectons
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold mb-2">Informations de compte :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Adresse email (pour l'authentification)</li>
                      <li>Nom d'affichage (choisi par vous)</li>
                      <li>Date de création du compte</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Données de consommation :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Types de consommations (alcool, cigarettes, nutrition)</li>
                      <li>Dates et heures des consommations</li>
                      <li>Quantités consommées</li>
                      <li>Statistiques et métriques calculées</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Données techniques :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Adresse IP (anonymisée)</li>
                      <li>Type de navigateur et appareil</li>
                      <li>Données de navigation (cookies de session uniquement)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Utilisation des données */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Comment nous utilisons vos données</h2>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="space-y-4 text-blue-700">
                  <div>
                    <h3 className="font-semibold mb-2">Finalités principales :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Fournir le service de suivi des consommations</li>
                      <li>Calculer vos statistiques et métriques personnelles</li>
                      <li>Générer des graphiques et visualisations</li>
                      <li>Maintenir la sécurité de votre compte</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Finalités secondaires :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Améliorer l'application et ses fonctionnalités</li>
                      <li>Assurer le bon fonctionnement technique</li>
                      <li>Respecter nos obligations légales</li>
                    </ul>
                  </div>
                  <div className="bg-blue-100 rounded-xl p-4 mt-4">
                    <p className="font-semibold">⚠️ Important :</p>
                    <p>Nous ne vendons jamais vos données à des tiers. Vos informations restent strictement privées.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Partage des données */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Partage de vos données</h2>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="space-y-3 text-green-700">
                  <p><strong>Principe :</strong> Vos données ne sont jamais partagées avec des tiers.</p>
                  <div>
                    <h3 className="font-semibold mb-2">Exceptions limitées :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Hébergeur :</strong> Firebase Hosting (Google Cloud Platform) pour l'hébergement de l'application</li>
                      <li><strong>Services techniques :</strong> Firestore Database et Firebase Authentication (Google)</li>
                      <li><strong>Obligations légales :</strong> Si requis par la loi ou une autorité compétente</li>
                      <li><strong>Protection des droits :</strong> Pour protéger nos droits ou ceux d'autrui</li>
                    </ul>
                  </div>
                  <div className="bg-green-100 rounded-xl p-4 mt-4">
                    <p className="font-semibold">✅ Garantie :</p>
                    <p>Tous nos prestataires sont soumis aux mêmes standards de protection des données.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Sécurité */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Sécurité de vos données
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold mb-2">Mesures techniques :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Chiffrement des données en transit (HTTPS)</li>
                      <li>Chiffrement des données au repos</li>
                      <li>Authentification sécurisée (Firebase Auth)</li>
                      <li>Surveillance continue de la sécurité</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Mesures organisationnelles :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Accès limité aux données personnelles</li>
                      <li>Formation à la protection des données</li>
                      <li>Audits de sécurité réguliers</li>
                      <li>Plan de réponse aux incidents</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Vos droits */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                Vos droits
              </h2>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="space-y-4 text-purple-700">
                  <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <h3 className="font-semibold mb-2">Droit d'accès</h3>
                      <p className="text-sm">Consulter toutes vos données personnelles</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <h3 className="font-semibold mb-2">Droit de rectification</h3>
                      <p className="text-sm">Corriger vos informations incorrectes</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <h3 className="font-semibold mb-2">Droit à l'effacement</h3>
                      <p className="text-sm">Supprimer votre compte et vos données</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-purple-200">
                      <h3 className="font-semibold mb-2">Droit à la portabilité</h3>
                      <p className="text-sm">Récupérer vos données dans un format lisible</p>
                    </div>
                  </div>
                  <div className="bg-purple-100 rounded-xl p-4 mt-4">
                    <p className="font-semibold">Comment exercer vos droits :</p>
                    <p className="text-sm mt-1">Utilisez les paramètres de votre compte ou contactez-nous directement.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Cookies et technologies</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p>Nous utilisons uniquement les cookies essentiels au fonctionnement de l'application :</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Cookies de session :</strong> Pour maintenir votre connexion</li>
                    <li><strong>Cookies de sécurité :</strong> Pour protéger votre compte</li>
                    <li><strong>Local Storage :</strong> Pour sauvegarder vos préférences</li>
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    Nous n'utilisons pas de cookies de tracking ou de publicité. 
                    Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact et réclamations</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p>Pour toute question concernant cette politique de confidentialité :</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Utilisez les paramètres de votre compte</li>
                    <li>Contactez-nous via l'application</li>
                    <li>Pour les réclamations : CNIL (Commission Nationale de l'Informatique et des Libertés)</li>
                  </ul>
                  <div className="bg-gray-100 rounded-xl p-4 mt-4">
                    <p className="font-semibold">Dernière mise à jour :</p>
                    <p className="text-sm mt-1">{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
