# Mon CV, en une page et sans dépendance

**[julien-becheny.github.io](https://julien-becheny.github.io)**

Ingénieur QA Automation, je conçois des frameworks de test multi-plateformes et
l'outillage qui va avec. Ce dépôt héberge mon CV en ligne : une page HTML, deux
feuilles de style, un script. Pas de framework, pas d'étape de build, pas de
`node_modules`.

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
un fichier figé : il bascule la page en document A4. Le thème sombre passe en noir sur
blanc, la navigation disparaît, les blocs ne se coupent plus entre deux pages, et le
site de sept écrans tient en trois pages. Le PDF ne peut donc jamais être en retard sur
le site.

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
index.html            tout le contenu
assets/css/style.css  affichage écran
assets/css/print.css  bascule en document A4
assets/js/main.js     impression, navigation, console
assets/img/           portrait et vignette de partage
```

## En local

Ouvrir `index.html` suffit. Pour un rendu identique à la production :

```bash
python -m http.server 8080
```

## Réemploi

Le code est libre de réemploi. Le contenu (texte, parcours, portrait) ne l'est pas.
