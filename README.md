# Portfolio d’Adrien Leteinturier

Portfolio Angular présentant le profil, les compétences et le parcours d’Adrien, aujourd’hui tech lead / lead dev chez La Française des Jeux (FDJ).

## Développement

Node.js 24.15 ou supérieur dans la branche 24 LTS.

```sh
npm ci
npm start
```

## Vérifications

```sh
npm test
npm run build
npm run format:check
npm audit
```

Les tests Vitest vérifient le contenu initial, les trois sections et le comportement accessible du menu mobile. Le build de production est généré dans `dist/projet/browser`.

Angular 22 fonctionne sans Zone.js, avec composants standalone, détection OnPush et signal pour le menu. Les effets CSS respectent `prefers-reduced-motion`. Les images et la police Titillium Web sont hébergées localement.

TypeScript reste en 6.0 et Vitest en 4.1 : leurs versions majeures suivantes ne sont pas compatibles avec les contraintes déclarées par `@angular/build@22.1.7`.

## Vercel

Le projet existant `adrien-leteinturier-web-dev` est lié au dépôt GitHub `Adrien-Leteinturier/AdrienLeteinturier-WebDev`.
La configuration versionnée dans `vercel.json` définit Angular, la commande de build et le dossier de sortie. La version de Node est fixée par `package.json`.

Le déploiement initial de cette refonte est réalisé via le connecteur MCP Vercel. La publication d’une branche Git ne remplace pas automatiquement la branche de production.
