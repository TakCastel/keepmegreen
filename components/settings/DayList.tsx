'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Search } from 'lucide-react';
import ConsumptionItem from './ConsumptionItem';
import ActivityItem from './ActivityItem';

interface DayListProps {
  paginatedData: any[];
  filteredData: any[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  getTotalItems: (day: any) => number;
  setAddModal: (modal: { isOpen: boolean; date: string }) => void;
  onRemoveConsumption: (date: string, category: 'alcohol' | 'cigarettes' | 'junkfood', type: any, currentQuantity: number) => void;
  onAddQuantity: (date: string, category: 'alcohol' | 'cigarettes' | 'junkfood', type: any) => void;
  onEditConsumption: (date: string, category: 'alcohol' | 'cigarettes' | 'junkfood', type: any, quantity: number) => void;
  onDeleteConsumption: (date: string, category: 'alcohol' | 'cigarettes' | 'junkfood', type: any) => void;
  onRemoveActivity: (date: string, category: 'sport' | 'social' | 'nutrition', type: any, currentQuantity: number) => void;
  onAddActivity: (date: string, category: 'sport' | 'social' | 'nutrition', type: any) => void;
  onEditActivity: (date: string, category: 'sport' | 'social' | 'nutrition', type: any, quantity: number) => void;
  onDeleteActivity: (date: string, category: 'sport' | 'social' | 'nutrition', type: any) => void;
  isRemoveConsumptionPending: boolean;
  isAddConsumptionPending: boolean;
  isMoveConsumptionPending: boolean;
  isRemoveActivityPending: boolean;
  isAddActivityPending: boolean;
  isMoveActivityPending: boolean;
}

export default function DayList({
  paginatedData,
  filteredData,
  totalPages,
  currentPage,
  setCurrentPage,
  getTotalItems,
  setAddModal,
  onRemoveConsumption,
  onAddQuantity,
  onEditConsumption,
  onDeleteConsumption,
  onRemoveActivity,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  isRemoveConsumptionPending,
  isAddConsumptionPending,
  isMoveConsumptionPending,
  isRemoveActivityPending,
  isAddActivityPending,
  isMoveActivityPending
}: DayListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Activités et observations
        </h3>
        <span className="text-gray-400 text-sm">
          {filteredData.length} jour{filteredData.length > 1 ? 's' : ''} trouvé{filteredData.length > 1 ? 's' : ''}
          {totalPages > 1 && (
            <span className="ml-2">
              • Page {currentPage} sur {totalPages}
            </span>
          )}
        </span>
      </div>

      {paginatedData.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">
            Aucune activité ou observation trouvée
          </h3>
          <p className="text-gray-600">
            Commencez à enregistrer vos activités et observations pour les voir ici
          </p>
        </div>
      ) : (
        paginatedData.map((day) => (
          <div key={day.date} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <div className="mb-4">
              {/* Version mobile - Layout vertical */}
              <div className="block sm:hidden">
                <h4 className="text-lg font-medium text-gray-800 mb-1">
                  {format(new Date(day.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">
                    {getTotalItems(day)} élément{getTotalItems(day) > 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setAddModal({ isOpen: true, date: day.date })}
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Ajouter</span>
                  </button>
                </div>
              </div>

              {/* Version desktop - Layout horizontal */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-medium text-gray-800">
                    {format(new Date(day.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                  </h4>
                  <span className="text-gray-500 text-sm">
                    ({getTotalItems(day)} élément{getTotalItems(day) > 1 ? 's' : ''})
                  </span>
                </div>
                <button
                  onClick={() => setAddModal({ isOpen: true, date: day.date })}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Ajouter</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {/* Observations */}
              {day.consumptions?.alcohol
                ?.map((item: { type: string; quantity: number }, index: number) => (
                  <ConsumptionItem
                    key={`alcohol-${index}`}
                    day={day.consumptions}
                    category="alcohol"
                    item={item}
                    index={index}
                    onRemove={onRemoveConsumption}
                    onAdd={onAddQuantity}
                    onEdit={onEditConsumption}
                    onDelete={onDeleteConsumption}
                    isRemovePending={isRemoveConsumptionPending}
                    isAddPending={isAddConsumptionPending}
                    isMovePending={isMoveConsumptionPending}
                  />
                ))
                .filter(Boolean)
              }
              
              {day.consumptions?.cigarettes
                ?.map((item: { type: string; quantity: number }, index: number) => (
                  <ConsumptionItem
                    key={`cigarettes-${index}`}
                    day={day.consumptions}
                    category="cigarettes"
                    item={item}
                    index={index}
                    onRemove={onRemoveConsumption}
                    onAdd={onAddQuantity}
                    onEdit={onEditConsumption}
                    onDelete={onDeleteConsumption}
                    isRemovePending={isRemoveConsumptionPending}
                    isAddPending={isAddConsumptionPending}
                    isMovePending={isMoveConsumptionPending}
                  />
                ))
                .filter(Boolean)
              }
              
              {day.consumptions?.junkfood
                ?.map((item: { type: string; quantity: number }, index: number) => (
                  <ConsumptionItem
                    key={`junkfood-${index}`}
                    day={day.consumptions}
                    category="junkfood"
                    item={item}
                    index={index}
                    onRemove={onRemoveConsumption}
                    onAdd={onAddQuantity}
                    onEdit={onEditConsumption}
                    onDelete={onDeleteConsumption}
                    isRemovePending={isRemoveConsumptionPending}
                    isAddPending={isAddConsumptionPending}
                    isMovePending={isMoveConsumptionPending}
                  />
                ))
                .filter(Boolean)
              }

              {/* Activités */}
              {day.activities?.sport
                ?.map((item: { type: string; quantity: number }, index: number) => (
                  <ActivityItem
                    key={`sport-${index}`}
                    day={day.activities}
                    category="sport"
                    item={item}
                    index={index}
                    onRemove={onRemoveActivity}
                    onAdd={onAddActivity}
                    onEdit={onEditActivity}
                    onDelete={onDeleteActivity}
                    isRemovePending={isRemoveActivityPending}
                    isAddPending={isAddActivityPending}
                    isMovePending={isMoveActivityPending}
                  />
                ))
                .filter(Boolean)
              }
              
              {day.activities?.social
                ?.map((item: { type: string; quantity: number }, index: number) => (
                  <ActivityItem
                    key={`social-${index}`}
                    day={day.activities}
                    category="social"
                    item={item}
                    index={index}
                    onRemove={onRemoveActivity}
                    onAdd={onAddActivity}
                    onEdit={onEditActivity}
                    onDelete={onDeleteActivity}
                    isRemovePending={isRemoveActivityPending}
                    isAddPending={isAddActivityPending}
                    isMovePending={isMoveActivityPending}
                  />
                ))
                .filter(Boolean)
              }
              
              {day.activities?.nutrition
                ?.map((item: { type: string; quantity: number }, index: number) => (
                  <ActivityItem
                    key={`nutrition-${index}`}
                    day={day.activities}
                    category="nutrition"
                    item={item}
                    index={index}
                    onRemove={onRemoveActivity}
                    onAdd={onAddActivity}
                    onEdit={onEditActivity}
                    onDelete={onDeleteActivity}
                    isRemovePending={isRemoveActivityPending}
                    isAddPending={isAddActivityPending}
                    isMovePending={isMoveActivityPending}
                  />
                ))
                .filter(Boolean)
              }

              {/* Bouton d'ajout si le jour est vide */}
              {getTotalItems(day) === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    En fait, j'ai oublié quelque chose...
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Cette journée était sereine, mais tu veux ajouter quelque chose que tu n'avais pas noté ?
                  </p>
                  <button
                    onClick={() => setAddModal({ isOpen: true, date: day.date })}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Oui, j'ai oublié quelque chose
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Précédent</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl transition-colors font-medium ${
                  page === currentPage
                    ? 'bg-slate-600 text-white'
                    : 'bg-white/70 hover:bg-white border border-gray-200 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Suivant</span>
          </button>
        </div>
      )}
    </div>
  );
}
