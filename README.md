# Site ABH-LOGISTIC

Site statique (HTML/CSS/JS), sans dépendance. Il suffit de déposer le contenu de ce dossier chez n'importe quel hébergeur (OVH, Hostinger, Netlify, cPanel…).

## Pages
- `index.html` — Accueil
- `a-propos.html` — À propos
- `services.html` — Services (ancres : #aerien #maritime #routier #groupage #douane #entreposage)
- `devis.html` — Demande de devis (`devis.html?mode=maritime` présélectionne le mode)
- `contact.html` — Contact
- `mentions-legales.html` — Mentions légales

## À personnaliser avant la mise en ligne
1. **Coordonnées** : domaine `www.abh-logistic.com` et e-mail `contact@abh-logistic.com` en place. Le **téléphone** `+213 (0) 770 25 47 86` est affiché dans l'en-tête, le pied de page, les pages Contact, Devis et Mentions légales.
2. **`js/main.js` → `CONFIG`** : numéro WhatsApp (laisser vide = boutons WhatsApp masqués), et `formEndpoint` (ex. Formspree) pour que les formulaires envoient directement sans ouvrir la messagerie du visiteur.
3. **Réseaux sociaux** : remplacer les liens `href="#"` Facebook / Instagram / LinkedIn.
4. **Mentions légales** : compléter les champs entre crochets (RC, NIF, NIS, hébergeur…).
5. **Photos** : chargées depuis Unsplash (licence libre, usage commercial autorisé). Pour les héberger vous-même, les télécharger dans `assets/img/` et remplacer les URL.

## Référencement et hébergement (déjà inclus)
- `404.html` : page d'erreur personnalisée (activée par `.htaccess` sur les hébergeurs Apache ; sur Netlify, le fichier `404.html` est pris en compte tout seul).
- `robots.txt` et `sitemap.xml` : à déclarer dans Google Search Console après la mise en ligne.
- Données structurées (fiche entreprise + FAQ) dans `index.html` pour un meilleur affichage dans Google.
- **Domaine** : les adresses canoniques, le sitemap et les données structurées utilisent `https://www.abh-logistic.com`. Si votre domaine est différent, remplacez cette adresse partout (rechercher/remplacer).

## Mise en ligne sur Hostinger
1. Connectez-vous à **hPanel** → **Sites web** → **Gérer** votre domaine.
2. Ouvrez **Fichiers → Gestionnaire de fichiers**, puis le dossier **`public_html`**.
3. Supprimez la page par défaut de Hostinger (`default.php` ou `index.php`) si elle existe.
4. Cliquez sur **Importer** (icône flèche vers le haut) et envoyez **`abh-logistic-site.zip`**.
5. Clic droit sur le zip → **Extraire** → laissez le dossier de destination vide (extraction directement dans `public_html`), puis supprimez le zip.
   `index.html`, `css/`, `js/`, `assets/` et `.htaccess` doivent se trouver directement dans `public_html` (pas dans un sous-dossier).
6. Dans hPanel → **Sécurité → SSL**, activez le certificat gratuit, puis forcez le HTTPS.
7. Ouvrez votre domaine dans le navigateur pour vérifier.

Astuce : pour voir le fichier caché `.htaccess` dans le Gestionnaire de fichiers, activez « Afficher les fichiers cachés » dans les paramètres.
