---
title: "L'assistant ne voit pas l'écran, alors il invente"
seo_title: "Donner à un assistant IA les vrais sélecteurs d'une application mobile, avec un serveur MCP"
description: "Un modèle qui écrit un test Appium propose des sélecteurs plausibles et faux, parce qu'il n'a jamais vu l'écran. Voici ce que change le fait de lui donner l'application réelle, et ce que ça coûte en contexte."
image: /assets/img/ecran-reel.png
image_alt: "Sans voir l'écran, l'assistant invente accessibility_id=bouton_valider. Avec l'écran réel, il reçoit des sélecteurs qui existent, classés de recommandé à fragile, et des sorties bornées : 400 lignes d'arbre, 15 éléments par recherche, captures de 1 280 px de large."
tags: [appium, mcp, ia, mobile, test automatisé, python]
---

Je demande à un assistant d'écrire un test sur une application mobile. Il me
propose :

```
accessibility_id=bouton_valider
```

C'est plausible. C'est exactement ce qu'un développeur soigneux aurait écrit. Et
ça n'existe pas dans l'application.

## Le modèle ne se trompe pas, il devine

Il n'a jamais vu l'écran. On lui a donné un ticket, peut-être une capture, et il
a produit ce qui ressemble le plus à un sélecteur correct. Statistiquement, il a
raison : `bouton_valider` est une excellente convention de nommage.

Sauf que l'application, elle, expose peut-être un `content-desc` généré, un
identifiant numérique, ou rien du tout.

Le résultat est le pire cas possible pour un test : **un échec qui n'a aucun
rapport avec le produit**. Le rapport est rouge, l'application va bien, et la
personne qui relit perd son temps à comprendre que l'élément n'a jamais existé.

C'est le même problème que celui des locators écrits à la main, en pire : à la
main, on finit par ouvrir l'inspecteur. Le modèle, lui, ne doute jamais.

## Lui montrer plutôt que lui décrire

La réponse n'est pas un meilleur prompt. Aucune formulation ne fait apparaître
une information que le modèle n'a pas.

La réponse est de lui donner accès à l'application. C'est exactement ce que
permet le Model Context Protocol : exposer des outils qu'un assistant peut
appeler de lui-même, pendant la conversation.

J'ai donc publié un serveur qui expose une session Appium :

```bash
pip install mcp-appium
```

Il se déclare auprès de l'assistant comme n'importe quel serveur MCP : une
commande, lancée sur l'entrée standard. Dans VS Code, `.vscode/mcp.json` :

```json
{
  "servers": {
    "appium": { "type": "stdio", "command": "mcp-appium" }
  }
}
```

L'assistant peut alors lire l'arbre de la vue courante, chercher un élément,
demander des suggestions de sélecteurs, cliquer, saisir, et voir le résultat.
Sur Android, iOS, iPadOS et Windows : les quatre plateformes où, comme je l'ai
raconté dans [Un bouton, quatre sélecteurs, un seul test](/blog/un-selecteur-par-plateforme/),
le même bouton ne se trouve pas de la même façon.

## Le cas qui compte : observer, pas piloter

On imagine volontiers l'assistant conduisant l'application tout seul. Ce n'est
pas l'usage le plus utile.

Le plus utile est beaucoup plus modeste : **un test tourne, il échoue sur un
élément, et on demande ce que l'écran contient vraiment.** Le serveur se rattache
à la session déjà ouverte, sans rien créer ni redémarrer. Il observe ce que le
test voit, au moment où il le voit, tant que la session vit encore : test arrêté
sur un point d'arrêt, ou avant que sa fin ne ferme l'application.

Et il ne la ferme pas en partant. Une session ouverte par un test appartient à ce
test : la couper interromprait l'exécution en cours. Le serveur ne ferme que les
sessions qu'il a lui-même créées.

C'est ce qui remplace le geste habituel : rouvrir l'inspecteur à côté, chercher
l'élément à la main, revenir au code.

## Le vrai problème technique : le coût du contexte

Voilà le point que je n'attendais pas en construisant cet outil, et qui s'est
révélé être le plus structurant.

Un arbre de vue Appium brut dépasse couramment plusieurs dizaines de milliers de
caractères.
Renvoyé tel quel au modèle, il produit trois effets, tous mauvais :

1. Il **sature la fenêtre de contexte** avant d'avoir appris quoi que ce soit
   d'utile.
2. Il **chasse le reste** : la conversation, le code, les consignes. Le modèle
   oublie ce qu'on lui a demandé pour retenir des `FrameLayout` imbriqués.
3. Il **se repaie à chaque échange suivant**, puisque ce qui entre dans le
   contexte y reste et lui est renvoyé à chaque tour.

Ce troisième point est le plus coûteux et le moins visible. Une lecture d'écran
qui coûte cher ne coûte pas cher une fois : elle coûte cher autant de fois qu'il
reste de messages dans la conversation.

Toutes les sorties sont donc plafonnées, et l'outil dit explicitement quand il
coupe : arbre simplifié à 400 lignes avec les seuls attributs qui servent à
cibler, source brute à 40 000 caractères, 15 éléments détaillés par recherche,
captures réduites à 1 280 pixels de large.

**Un outil d'inspection qui ne borne pas ses sorties est inutilisable en
conversation**, quelle que soit la qualité de ce qu'il expose. C'est la
différence entre un pont vers Appium et un outil pensé pour un modèle.

## Deux garde-fous qui viennent du métier

**Un tap vérifie son effet.** L'outil compare l'écran avant et après le clic, et
signale explicitement un clic resté sans conséquence. Un élément désactivé,
recouvert par une popup, ou hors de la zone tactile répond à `click()` sans rien
faire et sans lever d'erreur. Sans cette vérification, l'assistant croit avoir
avancé, et enchaîne les étapes suivantes dans le vide.

C'est exactement le même faux positif qui empoisonne les tests mobiles écrits à
la main. Un modèle ne fait que le produire plus vite.

**Les suggestions sont classées par robustesse.** L'identifiant d'accessibilité
d'abord, le XPath sur le texte en dernier, avec la mention qu'il cassera au
prochain changement de libellé. Le modèle reçoit donc une hiérarchie, pas une
liste.

## Ce que l'outil ne fait pas

Il n'écrit pas de tests et n'impose aucun framework. Il expose l'état de
l'application ; ce qu'on en fait reste au-dessus, avec les outils déjà en place.

Il ne dépend d'aucun service d'IA. Ni clé d'API, ni compte, ni appel sortant : le
seul réseau qu'il touche est le serveur Appium, local par défaut. C'est un choix, pas un
oubli. Un outil d'inspection qui exige un compte chez un fournisseur ferme la
porte à tous ceux dont l'application ne peut pas sortir du réseau interne, et
c'est précisément le cas des applications qui gagneraient le plus à être testées
sérieusement.

Il ne remplace pas Appium Inspector pour l'exploration manuelle. Son intérêt est
de donner ces informations à un modèle, ce qu'une interface graphique ne sait
pas faire.

## Ce que je retiens

Faire écrire un test par une IA est facile. Le rendre juste est un problème
d'ingénierie, et ce problème se résout en amont du modèle, pas dans la
formulation de la demande.

Un modèle qui invente un sélecteur n'a pas besoin d'être mieux instruit. Il a
besoin de pouvoir regarder.

---

Le code, la documentation et les exemples :
[github.com/julien-becheny/mcp-appium](https://github.com/julien-becheny/mcp-appium)
