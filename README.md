# Leo's — Porte-le à ta façon

Boutique en ligne complète pour la marque algérienne de streetwear oversize **Leo's**.
Un seul fichier à déployer, **aucune dépendance obligatoire**, **bilingue français / arabe (RTL)**, paiement à la livraison partout en Algérie.

---

## Contenu du dépôt

| Chemin | Rôle |
| --- | --- |
| `index.html` | Le site complet (HTML + CSS + JS en ligne). C'est le fichier à envoyer en production. |
| `build/01-css-base.css`, `build/02-css-ui.css` | Feuilles de style (thème, composants, responsive, RTL). |
| `build/03-head.html` → `build/05-tail.html` | Structure HTML (en-tête, sections, modales). |
| `build/06-script-data.js` | Données : 58 wilayas, couleurs, catalogue, avis, FAQ, réglages, dictionnaires FR/AR. |
| `build/07-script-render.js` | Rendu : grille produits, fiche produit, panier, guide des tailles, aperçu rapide. |
| `build/08-script-i18n.js` | Traductions arabes des textes statiques. |
| `build/09-script-app.js` | Interactions : panier, commande, gestion, héros 3D, langue. |
| `build/build.js` | Assemble `index.html` à partir des sources ci-dessus. |
| `assets/` | Visuels produits et photo « notre histoire ». |

**Modifier le site :** éditez les fichiers de `build/` puis lancez

```bash
node build/build.js      # régénère index.html + contrôles de structure
```

On peut aussi éditer `index.html` directement : le script compilé y est lisible et commenté.

---

## Fonctionnalités

**Boutique**
- 9 produits de démonstration (hoodies, t-shirts, sweats, pantalons, accessoires), filtres par catégorie, tri (sélection, nouveautés, prix), recherche instantanée.
- Page produit dédiée (`index.html?product=hoodie-onyx`) : galerie avec vignettes et zoom, choix couleur/taille, quantité, stock, guide des tailles, accordéons (détails, caractéristiques, livraison, entretien), avis clients, produits associés, partage, barre d'achat fixe sur mobile.
- Aperçu rapide depuis la grille, favoris enregistrés localement.

**Panier & commande**
- Tiroir latéral : variantes, quantités, sous-total, remise combo, frais de livraison en direct.
- Remise combo automatique (10 % dès 2 pièces, réglable) et **livraison offerte dès 2 articles** — le bandeau et le panier appliquent enfin la même règle.
- Frais de livraison réels par zone : Nord & Centre 500 DA, Est & Ouest 600 DA, Grand Sud 900 DA (les 58 wilayas sont réparties, y compris toutes les wilayas de l'Ouest).
- Choix **À domicile / Stop Desk** (tarif réduit), estimation du total honnête (« Total estimé » tant que la wilaya n'est pas choisie).
- Formulaire validé côté client : nom, **numéro algérien** (0555 / 0666 / 0777 / 0561 / +213…), wilaya obligatoire, adresse.
- Écran de confirmation avec référence de commande (`LEO-26006-184`), récapitulatif et bouton « Envoyer sur WhatsApp » qui transmet la commande complète à la boutique. **Le panier n'est vidé qu'après confirmation.**

**Bilingue**
- Français (par défaut) et arabe avec passage complet en RTL, prix en `DA` / `دج`, wilayas en français et en arabe, mémorisation du choix, bascule `?lang=ar`, détection de la langue du navigateur.

**Espace gestion**
- Accessible via `index.html?admin=1` (jamais exposé dans le menu public).
- Tableau de bord (produits, commandes locales, offre active), ajout/suppression de produits, mise en vente / épuisé, stock, réglages de la remise combo, frais par zone, pourcentage Stop Desk, délais, numéro WhatsApp, pixels Meta/TikTok, activation de la barre d'annonce, export JSON et réinitialisation de la démo.

**Technique**
- Aucune bibliothèque : le site fonctionne même hors ligne (polices Google Fonts avec repli système, images locales).
- Accessibilité : modales avec piège de focus, fermeture par `Échap` ou clic extérieur, `aria-*` cohérents, lien d'évitement, contrastes vérifiés, version entièrement utilisable au clavier.
- Héros 3D sans WebGL : calques SVG en `translateZ`, rotation au glisser (souris et tactile) et changement de couleur instantané.
- Animations d'apparition avec filet de sécurité : rien ne peut rester invisible.
- Champs à 16 px sur mobile (pas de zoom automatique iOS), `prefers-reduced-motion` respecté.

---

## Personnaliser

| Objectif | Où |
| --- | --- |
| Numéro WhatsApp de la boutique | Gestion → Intégrations (défaut : `213555000000`) |
| Remise combo / minimum d'articles | Gestion → Combo & remise |
| Frais de livraison, Stop Desk, délais | Gestion → Livraison |
| Catalogue | Gestion → Produits, ou `DEFAULT_PRODUCTS` dans `build/06-script-data.js` |
| Textes et traductions | Dictionnaires `I18N` (`build/06-script-data.js`, `build/08-script-i18n.js`) |
| Couleurs du thème | Variables CSS `:root` en haut de `build/01-css-base.css` |
| Photos produits | Remplacer les fichiers de `assets/` (mêmes noms) |

> Les réglages et le panier sont stockés dans le navigateur (`localStorage`). C'était le cas dans la version d'origine : le panier et les réglages de démonstration vivent côté client. Pour une mise en production réelle, brancher `submitOrder()` (dans `build/09-script-app.js`) sur une API ou un Google Sheet, et déplacer les réglages côté serveur.

---

## Corrigé depuis l'export initial

1. Le bandeau annonçait la livraison offerte : le panier la facturait — corrigé, une seule règle.
2. Les wilayas de l'Ouest (Oran, Tlemcen, Sidi Bel Abbès…) tombaient au tarif du Nord : zones complètes.
3. La remise combo était codée en dur par endroits : elle vient désormais du réglage et se met à jour partout.
4. Le panier était vidé avant confirmation : il ne l'est qu'après.
5. « Ajout rapide » ajoutait une taille `L` au hasard : la taille est demandée.
6. Le bouton Gestion était visible par tous : réservé à `?admin=1`.
7. Wilayas numérotées `01 → 58`, ajout des traductions arabes, téléphone validé, option Stop Desk.
8. Conflit entre l'animation de flottement et la rotation 3D du hoodie : enveloppes séparées.
9. Aucun gabarit de page produit : vraie fiche produit (galerie, variantes, guide des tailles, avis…).
10. Faux marqueurs de conformité (promesse de remise Stop Desk de 20 %, doublon d'infobulle, `FormData` inutilisé) : nettoyés, les textes disent exactement ce que fait le site.

---

© Leo's — prix en DZD, livraison 58 wilayas.
