# Tester le formulaire en local

Dans deux terminaux VS Code, à la racine du projet :

1. `npm run start:api` lance l'API sur `127.0.0.1:3000`, avec redémarrage automatique lors des modifications.
2. `npm start` lance Angular sur `http://localhost:4200` et transmet les appels `/api/**` à l'API locale.

Si Angular était déjà lancé avant l'ajout du proxy, redémarrer `npm start`.

Pour utiliser des points d'arrêt, lancer `npm run start:api` dans un « JavaScript Debug Terminal » de VS Code.

L'API accepte uniquement les requêtes POST avec un corps JSON. Les POST passent par `api/contact.mjs` et le handler de `contact-core.mjs`. Ouvrir directement l'URL de l'API dans le navigateur produit un GET et renvoie donc HTTP 405.

Configurer `GMAIL_APP_PASSWORD` dans l'environnement du serveur. Le handler attend l'envoi SMTP puis retourne HTTP 200 avec `{ sent: true }`, ou HTTP 502 avec `{ error: "EMAIL_SEND_FAILED" }` en cas d'échec. Le formulaire affiche le succès uniquement après confirmation et conserve les champs en cas d'erreur. Un test depuis le formulaire envoie un vrai e-mail.

Arrêter chaque serveur avec `Ctrl+C`.
