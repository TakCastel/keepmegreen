'use client';

import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: ReactNode;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  headerActions?: ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  showCloseButton = true,
  headerActions,
  className = ''
}: ModalProps) {
  if (!isOpen || typeof window === 'undefined') {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-6">
      <div className={`bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl ${sizeClasses[size]} w-full max-h-[85vh] flex flex-col border border-white/20 ${className}`}>
        {/* En-tête fixe */}
        {(title || subtitle || headerActions || showCloseButton) && (
          <div className="flex items-center justify-between p-8 border-b border-gray-200 flex-shrink-0">
            <div>
              {title && (
                <h3 className="text-2xl font-light text-gray-800 mb-2">
                  {title}
                </h3>
              )}
              {subtitle && (
                <div className="text-gray-600 text-sm font-medium">
                  {subtitle}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Contenu scrollable */}
        <div className="p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Composant spécialisé pour les modales de confirmation
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary' | 'success';
  isLoading?: boolean;
  icon?: ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'primary',
  isLoading = false,
  icon
}: ConfirmModalProps) {
  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 disabled:bg-red-400',
    primary: 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400',
    success: 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      className="max-w-md"
    >
      <div className="space-y-6">
        {/* Icône et message */}
        <div className="text-center">
          {icon && (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {icon}
            </div>
          )}
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>
        
        {/* Boutons d'action */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors flex items-center justify-center gap-2 ${variantClasses[confirmVariant]}`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Chargement...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
