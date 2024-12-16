# 🎄 Secret Santa App

Application de tirage au sort pour organiser votre Secret Santa entre amis !

## Fonctionnalités

- 🎅 Création d'une partie par un admin
- 👥 Gestion des participants
- 💑 Gestion des couples (impossibilité de tirer son/sa partenaire)
- 🎲 Tirage au sort unique
- 🎯 Interface responsive et festive

## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Le serveur backend démarrera sur http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm start
```

L'application frontend démarrera sur http://localhost:3001

## Utilisation

1. L'admin crée une partie :
   - Entre son nom
   - Ajoute la liste des participants
   - Définit les couples éventuels
   - Obtient un lien unique

2. Les participants :
   - Reçoivent le lien
   - Entrent leur prénom
   - Effectuent leur tirage au sort

## Déploiement

Pour déployer l'application, vous devrez :

1. Configurer les variables d'environnement
2. Construire le frontend : `cd frontend && npm run build`
3. Démarrer le backend : `cd backend && npm run start:prod`

## Technologies utilisées

- Frontend : React, TypeScript
- Backend : NestJS
- Style : CSS moderne avec animations

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.
