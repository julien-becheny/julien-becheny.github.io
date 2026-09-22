# Mon CV, en une page et sans dépendance

**[julien-becheny.github.io](https://julien-becheny.github.io)**

Ingénieur QA Automation, je conçois des frameworks de test multi-plateformes et
l'outillage qui va avec. Ce dépôt héberge mon CV en ligne : du HTML, trois feuilles
de style, un script. Pas de framework, pas d'étape de build, pas de `node_modules`.

## Pourquoi c'est fait comme ça

Un CV est lu par des gens pressés, parfois depuis un téléphone, parfois imprimé pour
être annoté en entretien. Les choix techniques découlent de là.

**Le contenu vit dans le HTML.** Pas de rendu côté client, pas de fichier de données
séparé. Si le JavaScript ne se charge pas, la page reste entière et lisible. Sur un CV,
une page blanche est éliminatoire, et l'indexation par les moteurs de recherche compte.

**Le script n'ajoute que du confort** : bouton d'impression, section courante dans la
navigation, apparitions au défilement. Rien d'essentiel n'en dépend. Le bouton flottant
est révélé par le script lui-même, pour qu'il n'existe pas s'il ne peut rien déclencher.

**Une feuille d'impression dédiée.** Le bouton « Enregistrer en PDF » ne télécharge pas
un fichier figé : il bascule la page en document A4. Les couleurs passent en noir sur
blanc, la navigation disparaît, les blocs ne se coupent plus entre deux pages, et le
site de sept écrans tient en trois pages. Le PDF ne peut donc jamais être en retard sur
le site.

**Deux ambiances, une seule mise en page.** La version claire est celle qui est servie ;
la sombre reste accessible depuis la barre de navigation. Les proportions, la structure
et les animations viennent du même fichier : la feuille claire ne redéfinit que les
couleurs et les quelques blocs qui lui sont propres.

**L'adresse e-mail est assemblée à l'exécution.** Le motif complet n'apparaît nulle part
dans le HTML servi : les aspirateurs d'adresses repartent les mains vides, un lecteur
humain voit un lien normal.

**Accessibilité et sobriété.** Lien d'évitement, structure de titres cohérente, focus
visible, fermeture au clavier, `prefers-reduced-motion` respecté. Une seule requête
externe, pour les polices.

## Un détail pour les gens du métier

Le bouton en bas à gauche rejoue mon profil sous la forme d'une sortie Robot Framework :
séparateurs, `| PASS |` alignés à droite, résumé de suite et chemins de rapports. C'est
l'outil avec lequel je travaille tous les jours.

## Structure

```
index.html                  l'accueil : positionnement, derniers articles, projets
cv.html                     le CV, version claire
cv-sombre.html              le CV, version sombre
blog/index.html             la liste des articles
_posts/                     les articles, en Markdown
_layouts/                   gabarits du blog et de l'accueil
_config.yml                 Jekyll : flux RSS, plan de site, forme des URLs
assets/css/style.css        mise en page, et thème sombre
assets/css/theme-clair.css  l'ambiance claire, posée par-dessus
assets/css/blog.css         articles et listes
assets/css/print.css        bascule en document A4
assets/js/main.js           impression, navigation, console
assets/img/                 portrait, vignette de partage, captures
```

Le site est construit par Jekyll, nativement sur GitHub Pages : aucun workflow à
maintenir, aucune construction locale nécessaire pour publier.

## En local

Ouvrir `cv.html` suffit pour le CV seul. Pour le site entier, gabarits et articles
compris :

```bash
bundle exec jekyll serve
```

## Réemploi

Le code est libre de réemploi. Le contenu (texte, parcours, portrait) ne l'est pas.
