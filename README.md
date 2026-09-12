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

## État du contact

Le formulaire de cette préversion n’est pas encore activé. `GET /api/contact` répond `available: false` ; les envois renvoient HTTP 503. Aucun faux succès, aucun stockage local de prospect, aucun e-mail n’est envoyé dans cet état.

La couche serveur indépendante du fournisseur est testée : schéma autorisé, champs bornés, honeypot, accord, origine autorisée, contenu JSON, limite 16 ko, challenge signé lié au client (3 secondes à 1 heure), et confirmation uniquement après acceptation du dépôt. Une panne conserve les champs côté interface.

La limitation distribuée et la déduplication doivent être appliquées atomiquement par le dépôt réel, avant d’activer le formulaire. L’interface de dépôt ne constitue pas une intégration Firebase opérationnelle.

## Raccordement restant

1. Authentifier Firebase et sélectionner le projet/la base (édition et région à vérifier avant le raccordement).
2. Prévoir les demandes privées et leur boîte d’envoi : aucune lecture/écriture publique ; accès administrateur uniquement.
3. Configurer l’authentification serveur sur Vercel, sans secret dans Angular ou le dépôt.
4. Configurer un transport d’e-mail automatique côté serveur. Le connecteur Gmail de Codex ne fournit pas de transport à une fonction Vercel. Voir les [options de notification](docs/contact-notification-options.md), notamment la dépréciation du service Firebase Extensions. Aucune activation facturée n’a été faite.
5. Raccorder le dépôt avec déduplication, quotas durables par IP hachée/e-mail haché et plafond global ; enregistrer atomiquement demande et notification.
6. Tester une soumission identifiée de bout en bout : retrouver le document privé et vérifier le message reçu dans Gmail, pas seulement son acceptation par un fournisseur.

Le destinataire personnel a été vérifié via Gmail. Il n’est pas inscrit dans le code public.

## Vercel

`vercel.json` réserve `/api/contact` à la fonction Node et sert Angular sur les autres routes. Le site déjà en production reste inchangé tant que stockage et notification ne sont pas finalisés et testés. La nouvelle vitrine est destinée à un déploiement preview dans cet état.

La branche `codex/modernize-portfolio` est publiée sur GitHub. Aucune automatisation ni publication sur les réseaux sociaux n’a été réalisée.

## Acquisition freelance

- [Plan concret sur 30 jours](docs/acquisition/plan-30-jours.md)
- [Huit brouillons, adaptations et modèles de messages](docs/acquisition/brouillons.md)
- [Routine et modèle de suivi privé](docs/acquisition/processus.md)

Ces livrables sont des propositions de travail. Aucun prospect réel ni aucune donnée de contact ne sont enregistrés dans le dépôt.

## Versions des outils

La version locale de Node est fixée par .nvmrc (24.20.0), npm par packageManager (12.0.2), avec leurs contraintes dans engines. Sur Vercel, la branche Node 24 est sélectionnée via engines ; Vercel gère sa version mineure. La commande d’installation affiche la version de Node puis exécute explicitement npm@12.0.2 ci.

Le runtime partagé de Codex n’est pas modifié. La validation locale utilise un exécutable Node isolé dans .tools/, non versionné. TypeScript 6.0.3 et Vitest 4.1.11 restent les versions compatibles avec Angular Build 22 ; leurs nouvelles versions majeures ne satisfont pas ses dépendances homologues.
