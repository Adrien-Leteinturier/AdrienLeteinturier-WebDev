# Tester le formulaire en local

Dans deux terminaux VS Code, à la racine du projet :

1. `npm run start:api` lance l'API sur `127.0.0.1:3000`, avec redémarrage automatique lors des modifications.
2. `npm start` lance Angular sur `http://localhost:4200` et transmet les appels `/api/**` à l'API locale.

Si Angular était déjà lancé avant l'ajout du proxy, redémarrer `npm start`.

Remplir le formulaire et l'envoyer. Le `console.log` existant dans `contact-core.mjs` affiche les données dans le terminal de l'API. Pour déboguer avec des points d'arrêt, exécuter `npm run start:api` dans un « JavaScript Debug Terminal » de VS Code.

L'API accepte uniquement les requ?tes POST avec un corps JSON. Les POST passent par `api/contact.mjs` et le handler de `contact-core.mjs`. Ouvrir directement l'URL de l'API dans le navigateur produit un GET et renvoie donc HTTP 405.

Si le handler ne répond pas encore, le serveur termine la requête avec `stored: false` : le formulaire affiche donc une erreur de confirmation et conserve les champs, même si les données ont bien été reçues. Ce test ne confirme ni un stockage ni un envoi d'e-mail. Le jeton `local-test` sert uniquement à ce test local.

Arrêter chaque serveur avec `Ctrl+C`.
