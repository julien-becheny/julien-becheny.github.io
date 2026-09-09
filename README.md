# CV de Julien Becheny

Site personnel statique, à publier sur GitHub Pages. Aucune dépendance, aucune
étape de build : le contenu vit dans le HTML, le JavaScript n'ajoute que du confort.

```
index.html            tout le contenu du CV
assets/css/style.css  affichage écran
assets/css/print.css  bascule en CV papier A4 (bouton « Enregistrer en PDF »)
assets/js/main.js     bouton PDF, section courante, apparitions
```

## Voir le site en local

Ouvrir `index.html` dans un navigateur suffit. Pour un rendu identique à la
production (chemins absolus, polices) :

```powershell
python -m http.server 8080
# puis http://localhost:8080
```

## Modifier le contenu

Tout est dans `index.html`, dans l'ordre des sections visibles. Les repères :

| Section | Ancre |
|---|---|
| Chiffres clés du hero | `class="stats"` |
| Principes de travail | `id="approche"` |
| Projets phares | `id="realisations"` |
| Stack technique | `id="competences"` |
| Expériences | `id="experience"` |
| Diplômes et certifications | `id="formation"` |

Ajouter une expérience = dupliquer un bloc `<li class="job">` dans la timeline.
La classe `job-current` marque le poste en cours (point coloré + badge).

## Générer le PDF

Bouton « Enregistrer en PDF » → boîte d'impression du navigateur → **Enregistrer
au format PDF**. Dans Chrome, décocher « En-têtes et pieds de page » pour retirer
la date et l'URL ajoutées automatiquement.

La feuille `print.css` bascule le thème sombre en noir sur blanc, masque la
navigation et empêche les blocs d'être coupés en deux entre deux pages.

## Publier sur GitHub Pages

1. Créer un dépôt **public** nommé exactement **`julien-becheny.github.io`**. Ce nom donne
   l'URL courte `https://julien-becheny.github.io/` ; avec tout autre nom, l'URL
   contiendrait le nom du dépôt. Le dépôt doit être public : GitHub Pages ne publie pas
   depuis un dépôt privé sur un compte gratuit.
2. Pousser le contenu de ce dossier sur la branche `main`.
3. Dépôt → *Settings* → *Pages* → Source : `Deploy from a branch`, branche `main`,
   dossier `/ (root)`.

La mise en ligne prend une minute environ. Chaque `git push` republie le site.

## Reste à décider

- **Portrait** : le fichier attendu est `assets/img/julien-becheny.jpg`. S'il est absent,
  le script masque le cadre plutôt que d'afficher une image cassée.
- **Adresse e-mail** : assemblée en JavaScript au chargement. Le motif complet n'apparaît
  pas dans le HTML servi, ce qui la met hors de portée des aspirateurs d'adresses.
- **Image de partage** : sans `og:image`, un lien collé dans LinkedIn ou Slack s'affiche
  sans vignette. Une image 1200x630 dans `assets/img/` corrigerait ça.
- **Polices** : Inter et JetBrains Mono sont chargées depuis Google Fonts. Les héberger
  dans `assets/fonts/` supprimerait cet appel à un tiers.
