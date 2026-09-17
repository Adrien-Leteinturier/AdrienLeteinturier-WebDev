# Vitrine freelance d’Adrien Leteinturier

Angular 22, Node.js 24.20.0 LTS et npm 12.0.2. Identité forêt/menthe, services WordPress et sur mesure, portfolio personnel, parcours professionnel et formulaire custom.

## Commandes

```sh
npm ci
npm start
npm test
npm run test:server
npm run build
npm run format:check
npm audit
```

## État du contact et acquisition

Le formulaire est actif : les demandes sont envoyées à `adrienleteinturier@gmail.com` via `GMAIL_APP_PASSWORD` côté serveur. Le champ `source` conserve l’attribution UTM (ou `direct`) dans la notification e-mail.

Les événements `lead_*` sont envoyés à `window.dataLayer` si un outil de mesure est installé, et émis sous forme d’événements `lead-analytics` pour rester compatible avec un branchement ultérieur sans imposer de fournisseur analytics.

Les visuels de campagne sont disponibles dans `src/assets/img/linkedin-banner.png` et `src/assets/img/campaign-square.png`. Les URLs de campagne doivent utiliser `utm_source`, `utm_medium` et `utm_campaign`.

La couche serveur indépendante du fournisseur est testée : schéma autorisé, champs bornés, honeypot, accord, origine autorisée, contenu JSON, limite 16 ko, challenge signé lié au client (3 secondes à 1 heure), et confirmation uniquement après acceptation du dépôt. Une panne conserve les champs côté interface.

La limitation distribuée et la déduplication doivent être appliquées atomiquement par le dépôt réel, avant d’activer le formulaire. L’interface de dépôt ne constitue pas une intégration Firebase opérationnelle.

## Raccordement restant

1. Authentifier Firebase et sélectionner le projet/la base (édition et région à vérifier avant le raccordement).
2. Prévoir les demandes privées et leur boîte d’envoi : aucune lecture/écriture publique ; accès administrateur uniquement.
3. Configurer l’authentification serveur sur Vercel, sans secret dans Angular ou le dépôt.
4. Configurer un transport d’e-mail automatique. Le connecteur Gmail de Codex ne fournit pas de transport à une fonction Vercel. L’extension officielle Firebase Trigger Email est une option, après vérification du projet : elle requiert un transport SMTP/OAuth et le plan Blaze. Aucune activation facturée n’a été faite.
5. Raccorder le dépôt avec déduplication, quotas durables par IP hachée/e-mail haché et plafond global ; enregistrer atomiquement demande et notification.
6. Tester une soumission identifiée de bout en bout : retrouver le document privé et vérifier le message reçu dans Gmail, pas seulement son acceptation par un fournisseur.

Le destinataire personnel est configuré côté serveur et n’est pas inscrit dans le code Angular public.

## Vercel

`vercel.json` réserve `/api/contact` à la fonction Node et sert Angular sur les autres routes. Le site déjà en production reste inchangé tant que stockage et notification ne sont pas finalisés et testés. La nouvelle vitrine est destinée à un déploiement preview dans cet état.

Aucun push GitHub ni automatisation de réseaux sociaux ne sont réalisés.

## Versions des outils

La version locale de Node est fixée par .nvmrc (24.20.0), npm par packageManager (12.0.2), avec leurs contraintes dans engines. Sur Vercel, la branche Node 24 est sélectionnée via engines ; Vercel gère sa version mineure. La commande d’installation affiche la version de Node puis exécute explicitement npm@12.0.2 ci.

Le runtime partagé de Codex n’est pas modifié. La validation locale utilise un exécutable Node isolé dans .tools/, non versionné. TypeScript 6.0.3 et Vitest 4.1.11 restent les versions compatibles avec Angular Build 22 ; leurs nouvelles versions majeures ne satisfont pas ses dépendances homologues.
