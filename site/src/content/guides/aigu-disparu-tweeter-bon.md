---
titre: "Pourquoi ton aigu a « disparu » alors que le tweeter est bon"
resume: "Le tweeter fonctionne, il est même mesurable au multimètre, et pourtant l'enceinte sonne sourde. Dans la majorité des cas la panne n'est pas dans le haut-parleur mais dans les trois composants placés devant lui."
rubrique: "Enceintes"
date: 2026-08-18
duree: "Deux heures de diagnostic"
difficulte: "Accessible"
brouillon: false
fiches: ["siare-cl240"]
sources:
  - titre: "Aide pour refaire un filtre — forum Audiovintage"
    url: "https://audiovintage.fr/leforum/viewtopic.php?f=88&start=10&t=12293"
  - titre: "La restauration des enceintes acoustiques — forum-hifi.fr"
    url: "https://forum-hifi.fr/thread-14996.html"
  - titre: "Réparer une enceinte hi-fi vintage — haut-parleur.net"
    url: "https://haut-parleur.net/lreparer-une-enceinte-hifi-vintage.html"
  - titre: "The ESR of capacitors — eMariete"
    url: "https://emariete.com/en/esr-resistance-equivalent-series-equivalent-capacitors/"
---

Le symptôme est toujours décrit de la même façon : « il n'y a plus
d'aigu », ou « une enceinte est plus terne que l'autre ». Le réflexe est
de soupçonner le tweeter. On sort le multimètre, on mesure la résistance
continue aux bornes, on trouve quelque chose comme 5 ou 6 Ω, et on
conclut qu'il est bon.

Cette mesure ne prouve presque rien. Elle dit que la bobine n'est pas
coupée. C'est tout. Et une bobine non coupée est le cas le plus fréquent
— ce qui veut dire que le diagnostic commence là où la plupart des gens
l'arrêtent.

## Ce qu'il y a entre l'ampli et le tweeter

Sur une enceinte deux ou trois voies des années 70, le signal traverse,
dans l'ordre : le bornier, le câblage interne, le filtre passif, les
cosses du haut-parleur, puis la bobine. Cinq occasions de perdre l'aigu,
dont une seule est le haut-parleur.

Par fréquence décroissante sur du matériel de cette époque :

**1. Le condensateur de la voie aigu a dérivé.** C'est le grand
classique. Le passe-haut qui protège le tweeter est calculé autour d'une
capacité donnée ; la fréquence de coupure est inversement
proportionnelle à cette capacité. Un chimique qui a perdu 20 % de sa
valeur remonte la coupure d'autant. Le tweeter, lui, va parfaitement
bien — il reçoit simplement une bande plus étroite. Et comme le
phénomène est progressif, personne ne l'entend arriver.

Le piège : sa capacité peut être correcte et sa résistance série
équivalente (ESR) partie en vrille. Le condensateur freine alors le
courant qu'il devrait laisser passer, sans que le capacimètre ne signale
quoi que ce soit. Voir le guide sur le diagnostic des condensateurs de
filtre.

**2. Les contacts sont oxydés.** Bornier, cosses Faston, soudures
fatiguées. Une oxydation ajoute une résistance de contact qui suffit à
déséquilibrer deux enceintes. On l'attribue systématiquement au
haut-parleur, à tort. C'est aussi la panne la moins chère à réparer, et
la première à écarter.

**3. La résistance d'ajustement a dérivé ou chauffé.** Beaucoup de
filtres comportent une résistance bobinée en série avec l'aigu, pour
ajuster son niveau à celui du grave. Une bobinée qui a chauffé change de
valeur. Le tweeter se retrouve atténué de plusieurs décibels sans que
rien ne soit cassé.

**4. Le potentiomètre d'aigu est encrassé.** Quand l'enceinte en a un.
Quarante ans sans bouger, une piste oxydée, et l'atténuation part
n'importe où. Manœuvre-le une dizaine de fois d'un bout à l'autre avant
de conclure quoi que ce soit : parfois ça suffit.

**5. La bobine du tweeter est effectivement morte.** Elle arrive en
dernier parce qu'elle est rare, et parce qu'elle se voit : résistance
infinie au multimètre, ou membrane qui ne bouge pas du tout.

## L'ordre de diagnostic qui fait gagner du temps

Le principe : aller du moins invasif au plus invasif, et se servir de la
seconde enceinte comme référence à chaque étape.

1. **Écoute croisée.** Inverse les câbles d'enceinte gauche et droite au
   niveau de l'ampli. Si le défaut suit l'enceinte, il est dans
   l'enceinte. S'il reste du même côté, c'est l'ampli ou la source — et
   tu viens d'économiser un démontage.
2. **Inverse ensuite les enceintes physiquement de place.** Si le défaut
   change de côté avec l'enceinte, c'est confirmé. S'il reste au même
   endroit de la pièce, tu as un problème d'acoustique, pas de matériel.
3. **Bornier et cosses.** Démonte, nettoie, remonte, réécoute. Beaucoup
   de « pannes » s'arrêtent ici.
4. **Potentiomètre**, s'il y en a un : manœuvre-le à fond dans les deux
   sens.
5. **Filtre.** Compare les mêmes composants entre les deux enceintes
   plutôt que de comparer à la valeur sérigraphiée. Deux filtres qui ont
   vieilli côte à côte dans la même pièce constituent la meilleure
   référence que tu auras jamais.
6. **Tweeter en direct**, en dernier. Alimenté à très faible niveau
   depuis un ampli, **toujours à travers un condensateur en série** —
   un tweeter branché en direct sur une source large bande meurt en une
   fraction de seconde.

## Ce qui doit t'alerter dans les deux sens

Un aigu qui a disparu **d'un seul coup** n'est pas une dérive de
condensateur : les chimiques ne meurent pas en une soirée. Cherche une
soudure cassée, une cosse débranchée, ou une bobine grillée par un coup
de niveau.

Un aigu qui recule **progressivement sur les deux enceintes** n'est
probablement pas une panne du tout. Vérifie ton audition avant ton
matériel — c'est désagréable à entendre, et c'est régulièrement la bonne
réponse.

## Ce que ce guide ne dit pas

Il ne donne pas de valeurs cibles par modèle. Les variantes de série
existent, y compris à l'intérieur d'une même référence commerciale, et
une table de valeurs recopiée en ligne est le genre d'erreur qui se
propage ensuite pendant dix ans. Relève tes propres valeurs sur tes
propres exemplaires, et compare gauche et droite.
