# Notification Gmail — décision technique préparée

État au 12 septembre 2026 : formulaire fermé. L'inspection de Chrome confirme l'accès au projet `adrien-leteinturier-webdev`, en formule Spark, sans base Firestore créée. L'accès navigateur ne fournit pas une identité serveur à Vercel.

Le projet Vercel possède déjà `SENDGRID_API_KEY` pour tous les environnements ; sa valeur n'a pas été affichée. Le transport `server/sendgrid-transport.mjs` est préparé et testé avec des réponses simulées. L'expéditeur vérifié, la validité de la clé et la réception réelle restent à vérifier. Ce module n'est pas encore branché dans l'API et n'active pas le formulaire.

## Option à privilégier

Conserver l'API Vercel existante et Firestore pour les demandes privées. Après une transaction enregistrant la demande, les quotas et une notification en attente, envoyer la notification depuis le serveur vers le destinataire Gmail fixe configuré dans l'environnement. Réutiliser en priorité un transport d'envoi déjà disponible dans le projet.

Le destinataire peut être Gmail sans que Gmail soit le fournisseur d'envoi. Le connecteur Gmail de Codex sert à vérifier la réception du test ; il ne donne pas à la fonction Vercel une authentification permanente.

Si aucun transport n'existe et que le compte le permet, SMTP Gmail avec un mot de passe d'application est une solution initiale à faible volume. Google impose la validation en deux étapes et certaines configurations de compte ne proposent pas cette option. Le secret doit être saisi dans les variables serveur, jamais dans le chat, Angular ou Git. À défaut, utiliser un transport SMTP/API existant autorisé ; OAuth Gmail reste possible mais demande une configuration et une gestion de jetons supplémentaires. [Conditions Google](https://support.google.com/accounts/answer/185833?hl=fr).

Ne pas promettre la gratuité de l'ensemble : vérifier les plans et quotas réellement disponibles pour Firebase, Vercel et le transport avant activation. Aucun changement de plan payant n'est autorisé ici.

## Fiabilité à implémenter avant activation

- Transaction atomique : demande, quota durable et notification en attente ; dédupliquer avec l'identifiant de demande.
- Expéditeur authentifié et destinataire fixés par le serveur ; adresse du visiteur seulement en Reply-To après validation. Aucun relais vers un destinataire fourni par le navigateur.
- Attendre une tentative d'envoi dans l'exécution serveur ; aucune promesse laissée en arrière-plan après la réponse HTTP.
- Conserver l'état d'envoi et l'erreur technique sans contenu privé dans les logs. Une panne email ne doit pas perdre la demande enregistrée.
- Prévoir un traitement sécurisé des notifications en attente avec verrou, nombre de tentatives borné et reprise selon les moyens du plan existant. Tant que cette reprise n'est pas implémentée et testée, l'intégration n'est pas prête. Un timeout SMTP peut survenir après acceptation : l'identifiant facilite le repérage d'un éventuel doublon, sans promettre un envoi exactement une fois.
- Tester le refus des accès publics, le spam, la déduplication, une panne du transport et la reprise. Puis effectuer une soumission identifiée et vérifier le document ainsi que le mail reçu dans Gmail. « Accepté par SMTP » ne prouve pas la réception.

## Alternative Firebase

Si le projet dispose déjà de fonctions et d'un plan adapté, un traitement Firestore par Cloud Functions peut gérer la boîte d'envoi et sa reprise. Choisir après inspection du projet, sans demander à Adrien de choisir un SDK ou une architecture.

Éviter une nouvelle installation de Trigger Email comme premier choix : le service Firebase Extensions est déprécié et sa fermeture est annoncée au 31 mars 2027. Les extensions déjà déployées continueront à s'exécuter mais leur gestion sera affectée. [Annonce officielle](https://firebase.google.com/docs/extensions/faq-and-troubleshooting). L'extension exige de toute façon un transport sortant configuré ; elle ne remplace pas un fournisseur d'email. [Documentation Trigger Email](https://firebase.google.com/docs/extensions/official/firestore-send-email).

## Seules informations à demander

Le projet est identifié et la session Chrome suffit pour sa console : aucune connexion CLI supplémentaire n'est imposée. Le choix de l'emplacement immuable de la nouvelle base est demandé (Paris proposé). Il faut ensuite autoriser/configurer l'identité serveur Firebase dans Vercel et vérifier l'expéditeur SendGrid existant. Ne pas demander de clé dans le chat ni faire arbitrer entre bibliothèques techniques.
