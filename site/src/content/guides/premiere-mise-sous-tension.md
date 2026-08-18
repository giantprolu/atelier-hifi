---
titre: "Le rituel avant la première mise sous tension d'un appareil dormant"
resume: "Un ampli qui a dormi vingt ans ne se rebranche pas sur le secteur. La lampe série, le reformage des chimiques, et l'ordre des vérifications qui évite de transformer une révision en remplacement de transformateur."
rubrique: "Amplification"
date: 2026-08-18
duree: "Une soirée, plus l'attente"
difficulte: "Intermédiaire"
brouillon: false
sources:
  - titre: "Dim bulb tester instructions — Retro Radio Shop"
    url: "https://www.retroradioshop.com/pages/dim_bulb_tester_instructions"
  - titre: "Conseils pour l'achat et la mise en service d'un ampli vintage — vintage-audio-laser.fr"
    url: "https://vintage-audio-laser.fr/viewtopic.php?t=2239"
  - titre: "Testeur à ampoules — radioman33.com"
    url: "https://www.radioman33.com/pages/mes-constructions/testeur-a-ampoules.html"
  - titre: "Reformer les condensateurs — forum Homecinema-fr"
    url: "https://www.homecinema-fr.com/forum/diy-amplification/variateur-halogene-pour-reformer-condensateurs-ampli-lampe-t30108306.html"
---

> **Danger — tension secteur et charges résiduelles.** Les condensateurs
> de filtrage d'une alimentation restent chargés longtemps après la
> coupure, parfois à plusieurs centaines de volts sur un appareil à
> tubes. On les décharge à la résistance de puissance, jamais au
> tournevis. Si tu n'as jamais travaillé sur du matériel relié au
> secteur, ce guide n'est pas le bon endroit pour commencer : fais-toi
> accompagner la première fois.

Un appareil qui a dormi longtemps ne redémarre pas comme il s'est
arrêté. Ses condensateurs chimiques ont perdu une partie de leur couche
d'oxyde, celle qui fait l'isolant du diélectrique. Rebranché d'un coup
sur 230 V, il tire un courant de fuite que rien ne limite — et ce qui
lâche en premier n'est pas le condensateur à 3 €, c'est le transformateur
d'alimentation ou le redresseur, c'est-à-dire ce qui ne se remplace pas.

D'où le rituel. Il n'a rien d'ésotérique : il consiste à ne jamais
appliquer la pleine tension à un circuit dont on ignore l'état.

## 1. Ne pas brancher. Regarder.

Avant l'électricité, l'inspection. Capot ouvert, appareil débranché,
lampe d'atelier.

- **Trace de fuite** sous les gros condensateurs de filtrage : dépôt
  brunâtre, croûte, corrosion des pattes. Un chimique qui a coulé se
  remplace avant toute mise sous tension.
- **Gonflement** du capot supérieur des chimiques.
- **Résistances brunies ou craquelées** — signe qu'elles ont chauffé
  au-delà de leur régime, donc qu'il y avait déjà un problème quand
  l'appareil a été rangé.
- **Cordon secteur** : gaine craquelée, âme apparente, prise fendue. Un
  cordon d'époque en caoutchouc durci se remplace, sans discussion.
- **Traces de bricolage antérieur** : soudures à l'étain gris et mat,
  composants dépareillés, fils volants. Quelqu'un est passé avant toi et
  n'a peut-être pas fini.

À ce stade, mesure la résistance du primaire du transformateur et
vérifie qu'il n'y a pas de court-circuit franc entre secteur et
châssis. Si le fusible d'origine a été remplacé par un calibre supérieur
ou par du fil, c'est un aveu : quelque chose consommait trop.

## 2. La lampe série

C'est l'outil qui change tout, et il coûte le prix d'une ampoule.

Le principe : on insère une ampoule **à incandescence** en série entre
le secteur et l'appareil. L'ampoule se comporte comme une résistance
qui augmente avec le courant. En fonctionnement normal, l'appareil
consomme peu, l'ampoule reste sombre et laisse passer la tension. En cas
de court-circuit, l'ampoule s'allume à plein éclat et absorbe l'énergie
au lieu de la laisser détruire le transformateur.

Ce qu'on lit sur l'ampoule :

| Comportement | Interprétation |
| --- | --- |
| Éclat vif qui ne retombe pas | Court-circuit franc. Débranche immédiatement. |
| Éclat vif qui décroît lentement | Charge des condensateurs en cours. Normal. |
| Lueur faible et stable | Consommation normale au repos. |
| Éclat qui remonte après quelques minutes | Quelque chose chauffe et dérive. Coupe. |

**Il faut une ampoule à filament.** Une LED ou une fluocompacte ne
présente pas cette résistance croissante et ne protège rien. C'est le
point qui rend l'outil de plus en plus difficile à monter, et qui
justifie de mettre de côté quelques ampoules classiques tant qu'on en
trouve.

Garde un jeu de calibres — 25, 40, 60, 100, 150 W. On commence bas :
plus l'ampoule est faible, plus elle limite, et plus le reformage des
chimiques se fait en douceur. On remonte en puissance au fur et à
mesure que l'appareil se comporte bien.

## 3. Le reformage

Sous lampe série faible, les condensateurs se rechargent
progressivement et leur couche d'oxyde se reconstitue. Le courant de
fuite décroît à mesure que le reformage progresse — c'est exactement ce
que traduit l'ampoule qui s'éteint peu à peu.

La méthode, par paliers :

1. Ampoule de faible puissance, mise sous tension, **observation**.
2. Si la lueur décroît et se stabilise bas, laisse quelques minutes.
3. Coupe, laisse refroidir, remonte d'un calibre.
4. Recommence jusqu'à la pleine tension.

Ce n'est pas une opération de vingt secondes. Compte une soirée, avec de
l'attente entre les paliers. Un chimique qu'on force ne se reforme pas,
il fuit.

Et surtout : **le reformage ne ressuscite pas un condensateur mort.** Il
récupère un condensateur simplement endormi. Si la lueur ne descend
jamais, le composant est à remplacer, pas à attendre.

## 4. L'ordre des vérifications, une fois sous tension

Toujours sous lampe série, toujours sans enceintes branchées :

1. **Tensions d'alimentation** aux points de mesure indiqués par le
   schéma, si tu l'as. Un écart important pointe l'alimentation.
2. **Tension continue en sortie haut-parleur.** C'est la mesure la plus
   importante de toutes. Quelques dizaines de millivolts sont normales ;
   plusieurs volts détruisent un haut-parleur en quelques secondes. Tant
   que ce point n'est pas propre, **aucune enceinte ne se branche**.
3. **Polarisation de l'étage de sortie**, selon la procédure du
   constructeur.
4. **Température** au bout de dix minutes. Un radiateur qu'on ne peut
   pas tenir au doigt sur un ampli au repos signale une polarisation
   partie trop haut.

Ce n'est qu'après ces quatre points qu'on branche une enceinte — et une
enceinte dont on se moque, pas la paire qu'on vient de restaurer.

## Ce que ce guide ne dit pas

Il ne donne ni schéma de câblage de la lampe série, ni valeurs de
tension par modèle. Le câblage implique du 230 V et se trouve
correctement décrit dans les sources citées ; les tensions se lisent sur
la documentation de ton appareil, jamais sur celle d'un modèle voisin.
Si tu as monté ce testeur et que tu as des photos du câblage, c'est un
excellent premier sujet pour le forum.
