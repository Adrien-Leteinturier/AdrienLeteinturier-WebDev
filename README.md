# Vitrine freelance d’Adrien Leteinturier

Angular 22, Node.js 24 LTS. Identité forêt/menthe, services WordPress et sur mesure, portfolio personnel, parcours professionnel et formulaire custom.

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
4. Configurer un transport d’e-mail automatique. Le connecteur Gmail de Codex ne fournit pas de transport à une fonction Vercel. L’extension officielle Firebase Trigger Email est une option, après vérification du projet : elle requiert un transport SMTP/OAuth et le plan Blaze. Aucune activation facturée n’a été faite.
5. Raccorder le dépôt avec déduplication, quotas durables par IP hachée/e-mail haché et plafond global ; enregistrer atomiquement demande et notification.
6. Tester une soumission identifiée de bout en bout : retrouver le document privé et vérifier le message reçu dans Gmail, pas seulement son acceptation par un fournisseur.

Le destinataire personnel a été vérifié via Gmail. Il n’est pas inscrit dans le code public.

## Vercel

`vercel.json` réserve `/api/contact` à la fonction Node et sert Angular sur les autres routes. Le site déjà en production reste inchangé tant que stockage et notification ne sont pas finalisés et testés. La nouvelle vitrine est destinée à un déploiement preview dans cet état.

Aucun push GitHub ni automatisation de réseaux sociaux ne sont réalisés.
