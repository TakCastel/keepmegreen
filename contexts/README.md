# PaywallContext

Le `PaywallContext` est un contexte React qui permet de gérer l'affichage global du paywall dans l'application de manière centralisée.

## Fonctionnalités

- **Gestion centralisée** : Un seul endroit pour contrôler l'affichage du paywall
- **Configuration flexible** : Possibilité de personnaliser le titre, la description et la fonctionnalité
- **Affichage conditionnel** : Le paywall s'affiche seulement quand nécessaire
- **Props personnalisées** : Support pour des callbacks personnalisés (ex: `onUpgrade`)

## Utilisation

### 1. Import du hook

```tsx
import { usePaywall } from '@/contexts/PaywallContext';
```

### 2. Utilisation dans un composant

```tsx
function MonComposant() {
  const { showPaywall, setShowPaywall, paywallConfig, setPaywallConfig } = usePaywall();

  const handleShowPaywall = () => {
    setPaywallConfig({
      feature: 'unlimitedHistory',
      title: 'Accès à l\'historique complet',
      description: 'Passez à Premium pour accéder à tous vos jours passés.'
    });
    setShowPaywall(true);
  };

  return (
    <div>
      <button onClick={handleShowPaywall}>
        Afficher le paywall
      </button>
      
      {showPaywall && paywallConfig && (
        <Paywall
          feature={paywallConfig.feature}
          title={paywallConfig.title}
          description={paywallConfig.description}
          onUpgrade={() => window.location.href = '/subscription'}
        />
      )}
    </div>
  );
}
```

## API

### PaywallContext

```tsx
interface PaywallContextType {
  showPaywall: boolean;           // État d'affichage du paywall
  setShowPaywall: (show: boolean) => void;  // Fonction pour afficher/masquer
  paywallConfig: {                // Configuration du paywall
    feature: string;
    title: string;
    description: string;
  } | null;
  setPaywallConfig: (config: PaywallConfig | null) => void;  // Fonction pour configurer
}
```

### Composant Paywall

Le composant `Paywall` accepte maintenant une prop `onUpgrade` optionnelle :

```tsx
interface PaywallProps {
  feature: string;
  title?: string;
  description?: string;
  showComparison?: boolean;
  onUpgrade?: () => void;  // Nouvelle prop pour callback personnalisé
}
```

## Exemple concret : CalendarDayModal

Dans le calendrier, quand un utilisateur clique sur un jour non accessible :

1. **Avant** : L'historique ET le paywall s'affichaient en même temps
2. **Maintenant** : Seul le paywall s'affiche avec un message personnalisé

```tsx
// Dans CalendarDayModal.tsx
{!canAccess ? (
  // Afficher seulement le paywall si pas d'accès
  <Paywall 
    feature="unlimitedHistory"
    title="Accès à l'historique complet"
    description="Ce jour fait partie de votre historique étendu..."
    onUpgrade={handleUpgrade}
  />
) : (
  // Afficher l'historique complet si accès autorisé
  <div>...</div>
)}
```

## Avantages

1. **UX améliorée** : Plus de confusion avec l'affichage simultané de l'historique et du paywall
2. **Code plus propre** : Logique centralisée et réutilisable
3. **Flexibilité** : Possibilité de personnaliser le comportement selon le contexte
4. **Maintenabilité** : Un seul endroit pour gérer l'affichage du paywall

## Configuration

Le `PaywallProvider` est déjà configuré dans `app/layout.tsx` et englobe toute l'application, donc vous pouvez utiliser le hook `usePaywall` dans n'importe quel composant.
