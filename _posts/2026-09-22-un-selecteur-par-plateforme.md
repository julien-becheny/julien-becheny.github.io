---
title: "Un bouton, quatre sélecteurs, un seul test"
seo_title: "Tester la même application sur Android, iOS, iPadOS et Windows sans dupliquer les sélecteurs"
description: "Le même bouton se trouve de quatre façons différentes selon la plateforme. Plutôt que dupliquer la suite ou semer des conditions dans les tests, le choix peut déménager dans une seule couche."
tags: [appium, mobile, robot framework, page object, python]
---

L'application que je teste tourne sur Android, iOS, iPadOS et Windows. Même code
applicatif, même écran, même bouton.

Et quatre façons de le trouver.

## Pourquoi quatre

L'identifiant est pourtant unique : le développeur l'a posé une fois, dans le
code partagé. Ce qui change, c'est **l'attribut sous lequel chaque système
d'exploitation l'expose** à l'automatisation.

```
Android    //*[@resource-id='...']
iOS        //*[@name='...']
Windows    //*[@AutomationId='...']
iPadOS     parfois encore autre chose
```

Le dernier cas mérite qu'on s'y arrête. iPadOS partage l'essentiel de son
comportement avec iOS, mais pas toujours : une disposition en plusieurs colonnes,
un composant qui devient une barre latérale, un élément présent sur l'un et
absent sur l'autre. Traiter iPad comme un iOS suffit dans la majorité des cas, et
échoue dans quelques-uns. C'est exactement le genre d'exception qui empoisonne
une architecture si on ne lui prévoit pas de place.

## Les deux réflexes, et ce qu'ils coûtent

**Dupliquer la suite par plateforme.** Chaque scénario existe en quatre
exemplaires. Une évolution fonctionnelle se répercute quatre fois, et le jour où
l'une des copies prend du retard, plus personne ne sait laquelle fait foi. La
maintenance est multipliée par quatre, mais surtout, la confiance est divisée.

**Semer des conditions dans les tests.** Le scénario métier se retrouve noyé sous
la plomberie. Un test censé décrire un parcours d'achat parle soudain de
`resource-id` et de `AutomationId`. Il devient illisible pour la seule personne
qui devrait pouvoir le relire : celle qui connaît le métier, pas l'outil.

Les deux approches ont le même défaut de fond : elles laissent une question
d'infrastructure remonter jusqu'au niveau où l'on décrit le comportement attendu.

## Le « if » ne disparaît pas, il déménage

C'est tout le principe, et il tient en une phrase.

La condition est irréductible : quatre plateformes exposent quatre attributs, il
faudra bien choisir à un moment. Ce qui se décide, c'est **où** ce choix est
écrit.

Une seule couche le porte. Les tests n'en savent rien. Les éléments sont déclarés
au même endroit, avec deux cas de figure :

- **identifiant commun aux plateformes** : une ligne, et le sélecteur de chaque
  système est dérivé automatiquement ;
- **comportement divergent** : on surcharge uniquement la plateforme concernée.

Le second point est ce qui rend le premier tenable. Sans lui, la moindre
exception ferait sauter tout l'édifice et ramènerait les conditions dans les
tests.

## Ce que ça change, concrètement

Une montée de version du système qui casse un sélecteur iOS, c'est **une ligne à
corriger**. Pas une chasse à travers toute la suite, pas un inventaire des
endroits où cet élément est mentionné.

C'est la différence entre un correctif de deux minutes et une demi-journée de
recherche, répétée à chaque mise à jour majeure. Sur un cycle de plusieurs
années, c'est cette ligne-là qui décide si la suite de tests survit ou si elle
est abandonnée.

## Les règles de repli

Trois règles, dans cet ordre :

1. **iPadOS retombe sur iOS** quand aucun sélecteur spécifique n'est déclaré.
2. **Toute plateforme retombe sur un `default`** commun.
3. **Rien de trouvé lève une erreur explicite**, plutôt que de rendre une valeur
   vide qui échouerait vingt lignes plus loin.

Le troisième point est le plus important, et c'est celui qu'on oublie en écrivant
ce genre de couche. Un sélecteur introuvable qui renvoie une chaîne vide produit
un échec à retardement, dans un message qui ne parle ni de plateforme ni de
déclaration manquante. Mieux vaut échouer tout de suite, en nommant la cause.

## Ne pas déclarer la plateforme à la main

Un dernier détail fait la différence à l'usage : la couche peut lire la
plateforme **directement depuis la session d'automatisation en cours**, au lieu
de la recevoir en paramètre.

```python
use_appium(driver)      # la session connaît déjà sa plateforme
LOGIN.resolve()         # le bon sélecteur, sans rien déclarer
```

L'intérêt n'est pas d'économiser une ligne. C'est qu'une déclaration manuelle est
une information dupliquée, donc une information qui finira par mentir : on lance
sur iPad avec un paramètre resté sur `ios`, et le test échoue en désignant un
élément, jamais la configuration.

## Extrait, nettoyé, publié

Ce besoin n'a rien de spécifique à mon projet. Toute équipe qui teste la même
application sur plusieurs systèmes rencontre exactement le même mur.

Je l'ai donc sorti de mon dépôt :

```bash
pip install crosslocator
```

Zéro dépendance d'exécution, typé, sous licence MIT. Il fournit des mots-clés
Robot Framework, et des exemples exécutables sans appareil connecté, pour qu'on
puisse le juger avant de l'installer quelque part.

L'adoption se fait **écran par écran** : rien n'oblige à convertir une suite
entière. Un seul écran migré suffit à voir ce que ça donne.

## Ce qu'il ne fait pas

Un mot là-dessus, parce que c'est ce qui manque à la plupart des annonces
d'outils.

Il **n'encapsule pas le driver**. Il ne fait que router des chaînes de
sélecteurs, et vous les passez à votre bibliothèque habituelle comme avant. C'est
délibéré : une couche qui s'interpose entre le test et le driver devient une
dépendance dont on ne sort plus, et elle casse à chaque montée de version de ce
qu'elle enveloppe.

Il ne corrige pas non plus un mauvais ancrage. Si votre identifiant est régénéré
à chaque compilation, il sera tout aussi instable une fois déclaré proprement.
Ranger le problème ne le résout pas : c'est une autre discussion, et elle vient
avant celle-ci.

---

Le code, la documentation et les exemples :
[github.com/julien-becheny/crosslocator](https://github.com/julien-becheny/crosslocator)
