# Correcteur à critères

*Conçu par Jean-François Désilets et Sovannie Sir, Collège Montmorency.*

Outil de correction des rapports de laboratoire : commentaires **audio**, **écrits** et **dessinés** directement sur le PDF de l'étudiant, regroupés par **critères d'évaluation** avec une note par critère. L'étudiant reçoit un simple fichier `.html` qui s'ouvre dans n'importe quel navigateur, même sur un téléphone.

Fonctionne sur ordinateur, tablette et téléphone, et hors ligne une fois installé.

## Confidentialité

Les rapports, l'audio, les commentaires et les notes **restent sur l'appareil de l'enseignant**. L'outil n'a aucun serveur et n'envoie rien :

- les PDF sont convertis, l'audio enregistré et encodé, et les fichiers exportés **dans le navigateur** ;
- les bibliothèques (PDF.js, lamejs, JSZip) sont incluses dans `lib/` : aucun appel à d'autres sites ;
- une règle de sécurité dans `index.html` (`Content-Security-Policy`, `connect-src 'none'`, `form-action 'none'`) interdit au navigateur toute connexion sortante ;
- l'hébergeur voit seulement qu'un appareil a chargé la page.

Sur un ordinateur partagé : bouton **« Effacer les données de cet appareil »** dans le panneau de droite.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | l'outil |
| `lib/` | lecteur PDF, encodeur MP3, module zip (licences : `lib/LICENCES.txt`) |
| `sw.js` | fonctionnement hors ligne : garde une copie de l'outil sur l'appareil |
| `manifest.webmanifest`, `icons/` | nom et icône quand l'outil est installé comme une application |
| `.nojekyll` | demande à GitHub Pages de servir les fichiers tels quels |

## Utiliser

- **En ligne :** ouvrir l'adresse du site (HTTPS obligatoire pour le micro et le mode hors ligne).
- **Installer sur iPhone / iPad :** dans Safari, *Partager* → *Sur l'écran d'accueil*.
- **Installer sur Android :** dans Chrome, menu → *Installer l'application*.
- **Sans mise en ligne, sur un ordinateur :** télécharger le dossier complet et ouvrir `index.html` (le dossier `lib/` doit rester à côté).

## Mettre à jour

- Modification de `index.html` seulement : publier le fichier, c'est tout (la page est revérifiée à chaque ouverture en ligne).
- Modification d'un autre fichier (`lib/`, `icons/`, `manifest.webmanifest`) : changer aussi la ligne `VERSION` au début de `sw.js`. Les enseignants verront « Nouvelle version disponible ».
