'use client';

import { FileText, ArrowLeft, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-light text-gray-800">
              Conditions Générales <span className="font-semibold text-emerald-600">d'Utilisation</span>
            </h1>
          </div>
          <p className="text-gray-600 text-base md:text-lg">
            Règles et conditions d'utilisation de l'application Keepmegreen
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 1 - Objet</h2>
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <div className="space-y-3 text-emerald-700">
                  <p>
                    Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de l'application 
                    <strong> Keepmegreen</strong>, un outil de suivi personnel des habitudes de consommation.
                  </p>
                  <p>
                    L'utilisation de l'application implique l'acceptation pleine et entière des présentes conditions.
                  </p>
                </div>
              </div>
            </section>

            {/* Définitions */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 2 - Définitions</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Application :</strong> Keepmegreen, service web de suivi personnel</p>
                  <p><strong>Utilisateur :</strong> Toute personne utilisant l'application</p>
                  <p><strong>Données :</strong> Informations de consommation saisies par l'utilisateur</p>
                  <p><strong>Éditeur :</strong> Keepmegreen, responsable de l'application</p>
                </div>
              </div>
            </section>

            {/* Acceptation */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 3 - Acceptation des conditions</h2>
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="space-y-3 text-blue-700">
                  <p>L'utilisation de l'application implique l'acceptation des présentes CGU.</p>
                  <div className="bg-blue-100 rounded-xl p-4">
                    <p className="font-semibold">✅ Conditions d'acceptation :</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Être majeur ou avoir l'autorisation parentale</li>
                      <li>Fournir des informations exactes lors de l'inscription</li>
                      <li>Respecter les présentes conditions d'utilisation</li>
                      <li>Utiliser l'application à des fins personnelles uniquement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Description du service */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 4 - Description du service</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h3 className="font-semibold mb-2">Fonctionnalités principales :</h3>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Enregistrement des consommations (alcool, cigarettes, nutrition)</li>
                      <li>Suivi des statistiques et métriques personnelles</li>
                      <li>Génération de graphiques et visualisations</li>
                      <li>Historique des données et évolution</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-yellow-800">Important :</p>
                        <p className="text-yellow-700 text-sm mt-1">
                          Cette application ne remplace pas un suivi médical professionnel. 
                          Consultez un professionnel de santé pour toute question médicale.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Obligations de l'utilisateur */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 5 - Obligations de l'utilisateur</h2>
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="space-y-4 text-green-700">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Utilisation conforme :
                    </h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Utiliser l'application à des fins personnelles uniquement</li>
                      <li>Saisir des informations exactes et à jour</li>
                      <li>Respecter la confidentialité des autres utilisateurs</li>
                      <li>Ne pas tenter de contourner les mesures de sécurité</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Interdictions :
                    </h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Partager son compte avec d'autres personnes</li>
                      <li>Utiliser l'application à des fins commerciales</li>
                      <li>Tenter d'accéder aux données d'autres utilisateurs</li>
                      <li>Utiliser l'application de manière illégale</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Responsabilités */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 6 - Responsabilités</h2>
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <div className="space-y-4 text-red-700">
                  <div>
                    <h3 className="font-semibold mb-2">Limitation de responsabilité :</h3>
                    <p>L'éditeur ne peut être tenu responsable :</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li>Des décisions prises sur la base des données de l'application</li>
                      <li>De l'interprétation des statistiques et métriques</li>
                      <li>Des interruptions temporaires du service</li>
                      <li>De la perte de données due à une utilisation incorrecte</li>
                    </ul>
                  </div>
                  <div className="bg-red-100 rounded-xl p-4 mt-4">
                    <p className="font-semibold">⚠️ Disclaimer médical :</p>
                    <p className="text-sm mt-1">
                      Cette application ne constitue pas un avis médical. 
                      Consultez un professionnel de santé pour toute question concernant votre bien-être.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 7 - Propriété intellectuelle</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Propriété de l'application :</strong> Tous les éléments (design, code, contenu) sont protégés par le droit d'auteur.</p>
                  <p><strong>Propriété des données :</strong> Les données personnelles de l'utilisateur restent sa propriété exclusive.</p>
                  <p><strong>Utilisation :</strong> L'utilisation de l'application ne confère aucun droit de propriété sur les éléments de l'application.</p>
                </div>
              </div>
            </section>

            {/* Protection des données */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 8 - Protection des données</h2>
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="space-y-3 text-purple-700">
                  <p>Le traitement des données personnelles est régi par notre Politique de Confidentialité.</p>
                  <p>L'utilisateur dispose des droits prévus par le RGPD (accès, rectification, effacement, portabilité).</p>
                  <p>Les données sont conservées jusqu'à suppression du compte par l'utilisateur.</p>
                </div>
              </div>
            </section>

            {/* Modification du service */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 9 - Modification du service</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p>L'éditeur se réserve le droit de modifier ou d'interrompre le service à tout moment.</p>
                  <p>Les utilisateurs seront informés des modifications importantes par notification dans l'application.</p>
                  <p>L'utilisation continue de l'application après modification implique l'acceptation des nouvelles conditions.</p>
                </div>
              </div>
            </section>

            {/* Résiliation */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 10 - Résiliation</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Résiliation par l'utilisateur :</strong> L'utilisateur peut supprimer son compte à tout moment depuis les paramètres.</p>
                  <p><strong>Résiliation par l'éditeur :</strong> En cas de non-respect des présentes conditions.</p>
                  <p><strong>Conséquences :</strong> La résiliation entraîne la suppression définitive des données personnelles.</p>
                </div>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Article 11 - Droit applicable et juridiction</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Loi applicable :</strong> Droit français</p>
                  <p><strong>Juridiction compétente :</strong> Tribunaux français</p>
                  <p><strong>Règlement des litiges :</strong> Tentative de résolution amiable avant recours judiciaire</p>
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
