# Application de Recherche d'Adresses et d'Entreprises

Une application React moderne pour rechercher des adresses et des entreprises en France avec cartographie interactive.

## 🚀 Fonctionnalités

### Recherche d'Adresses
- Recherche d'adresses en temps réel avec l'API Adresse.data.gouv.fr
- Autocomplétion intelligente avec debouncing
- Géolocalisation pour centrer sur votre position
- Historique de recherche et favoris
- Statistiques de session
- Carte interactive avec marqueurs personnalisés

### Recherche d'Entreprises
- Recherche d'entreprises par ville
- Données du répertoire Sirene (avec fallback vers données simulées)
- Informations détaillées sur les établissements
- Localisation sur carte interactive
- Pagination des résultats
- Filtrage par état administratif

### Interface Utilisateur
- Navigation fluide avec React Router
- Interface responsive et moderne avec Tailwind CSS
- Cartes interactives avec Leaflet
- Animations et transitions
- Mode sombre/clair (à venir)

## 🛠️ Technologies Utilisées

- **React 18** avec TypeScript
- **Vite** pour le bundling
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Leaflet** pour les cartes interactives
- **Lucide React** pour les icônes
- **API Adresse.data.gouv.fr** pour les adresses
- **API Sirene** pour les entreprises

## 📦 Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd address-search-app

# Installer les dépendances
pnpm install

# Lancer le serveur de développement
pnpm run dev
```

## 🗂️ Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── AddressSearch.tsx
│   ├── CompanySearch.tsx
│   ├── AddressMap.tsx
│   ├── Navigation.tsx
│   └── ...
├── hooks/              # Hooks personnalisés
│   ├── useAddressSearch.ts
│   ├── useCompanySearch.ts
│   └── ...
├── pages/              # Pages de l'application
│   ├── AddressPage.tsx
│   ├── CompanyPage.tsx
│   └── NotFoundPage.tsx
├── types/              # Types TypeScript
│   ├── address.ts
│   └── company.ts
└── ...
```

## 🌐 Routes Disponibles

- `/` - Recherche d'adresses
- `/companies` - Recherche d'entreprises
- `*` - Page 404

## 🎯 Utilisation

### Recherche d'Adresses
1. Saisissez une adresse dans la barre de recherche
2. Sélectionnez une adresse dans les résultats
3. Consultez la localisation sur la carte
4. Copiez les coordonnées si nécessaire

### Recherche d'Entreprises
1. Saisissez le nom d'une ville
2. Parcourez les entreprises trouvées
3. Cliquez sur une entreprise pour la localiser
4. Utilisez la pagination pour voir plus de résultats

## 🔧 Scripts Disponibles

```bash
pnpm run dev          # Serveur de développement
pnpm run build        # Build de production
pnpm run preview      # Aperçu du build
pnpm run lint         # Vérification ESLint
```

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Mobile : Interface simplifiée avec navigation tactile
- Tablette : Layout adaptatif avec cartes redimensionnées
- Desktop : Interface complète avec vue en deux colonnes

## 🗺️ Fonctionnalités de Carte

- Marqueurs personnalisés pour les adresses et entreprises
- Popups informatifs avec détails
- Contrôles de zoom et de navigation
- Recentrage automatique sur les résultats
- Copie des coordonnées GPS

## 🔮 Améliorations Futures

- [ ] Mode sombre/clair
- [ ] Export des résultats en CSV/JSON
- [ ] Filtres avancés pour les entreprises
- [ ] Sauvegarde des recherches
- [ ] API personnalisée pour les entreprises
- [ ] Tests unitaires et d'intégration
- [ ] PWA (Progressive Web App)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
