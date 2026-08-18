---
titre: "Reconnaître un condensateur de filtre mort sans le dessouder"
resume: "Un chimique de filtre passif peut être hors service sans rien montrer. Ce qui se mesure en place, ce qui ne se mesure qu'en l'air, et pourquoi la capacité seule ne suffit jamais à conclure."
rubrique: "Enceintes"
date: 2026-08-18
duree: "Une heure"
difficulte: "Accessible"
brouillon: false
sources:
  - titre: "ESR meter — principe de la mesure en circuit (Wikipedia)"
    url: "https://en.wikipedia.org/wiki/ESR_meter"
  - titre: "The ESR of capacitors — eMariete"
    url: "https://emariete.com/en/esr-resistance-equivalent-series-equivalent-capacitors/"
  - titre: "Advanced capacitor testing beyond the multimeter — Specap"
    url: "https://specap.com/resources/blog/advanced-capacitor-testing-beyond-multimeter"
  - titre: "Les condensateurs MKP en remplacement — forum Audiovintage"
    url: "https://www.audiovintage.fr/leforum/viewtopic.php?t=1735"
---

Un condensateur de filtre passif ne meurt presque jamais de façon
spectaculaire. Il ne coule pas, il ne gonfle pas, il ne noircit pas. Il
dérive. Et comme il dérive lentement, sur quinze ou vingt ans, personne
ne l'entend partir : on entend seulement, un jour, que « l'enceinte
gauche est moins vivante que la droite ».

C'est la panne la plus fréquente sur une enceinte française des
années 70, et c'est aussi celle qu'on diagnostique le plus mal, parce
que le réflexe — sortir le multimètre, lire la capacité, comparer à la
sérigraphie — donne une réponse rassurante et incomplète.

## Deux façons de mourir, une seule qui se voit au multimètre

Un chimique vieillissant part sur deux axes indépendants.

**La capacité dérive.** L'électrolyte s'assèche, la surface active
diminue, la valeur baisse. Un 4,7 µF qui mesure 3,9 µF déplace la
fréquence de coupure du filtre vers le haut — mécaniquement, puisque
cette fréquence est inversement proportionnelle à la capacité. Le
tweeter reçoit moins de bande. L'aigu recule.

**L'ESR monte.** L'ESR — résistance série équivalente — est la
résistance parasite en série avec le condensateur idéal. C'est le mode
de défaillance dominant des chimiques, et c'est celui qui trompe : un
condensateur peut afficher sa capacité nominale et être électriquement
inutilisable, parce que sa résistance série est devenue telle qu'il
freine le courant qu'il est censé laisser passer.

Autrement dit : **un capacimètre seul ne peut pas conclure.** Il répond
à une question sur deux.

## Ce qui se mesure sans dessouder

L'intérêt de l'ESR-mètre est là : il mesure en place. Il injecte un
petit signal alternatif — typiquement 100 kHz, quelques dizaines de
millivolts — et lit la partie résistive de l'impédance. À cette
fréquence, la réactance capacitive d'un chimique est très basse : ce
qui reste à lire, c'est la résistance série.

La tension d'essai est volontairement faible. Elle reste sous le seuil
de conduction des jonctions silicium, ce qui rend la mesure en circuit
exploitable sur une carte. Sur un filtre d'enceinte, il n'y a de toute
façon pas de semi-conducteurs — le vrai risque de fausse lecture vient
d'ailleurs.

**Les deux conditions à respecter :**

1. **Circuit hors tension et condensateurs déchargés.** Non négociable.
2. **Rien de faible impédance en parallèle.** Sur un filtre passif, une
   self de grave placée en parallèle du condensateur mesuré présente une
   résistance continue de quelques dixièmes d'ohm. L'ESR-mètre la voit et
   annonce un condensateur parfait qui ne l'est pas.

C'est la limite dont personne ne parle assez : sur un filtre deux voies
simple, la mesure en place est fiable sur la branche aigu, douteuse dès
qu'une self partage le nœud.

## Ce qui ne se mesure qu'en l'air

La capacité. Un capacimètre en circuit lit le condensateur **et** tout
ce que le filtre lui met en parallèle. Sur un filtre, ça arrive tout le
temps.

Donc : ESR en place pour trier, capacité en l'air pour conclure. Et si
tu dessoudes pour mesurer la capacité, tu as déjà fait 80 % du travail
de remplacement — autant remplacer.

## La méthode qui évite de tout démonter

1. **Compare les deux enceintes avant de toucher quoi que ce soit.**
   C'est le meilleur instrument que tu possèdes : deux exemplaires du
   même filtre, ayant vieilli dans la même pièce. Un écart d'ESR d'un
   facteur deux entre gauche et droite sur le même composant est un
   diagnostic, pas une hypothèse.
2. **Relève tout avant de dessouder.** Valeur sérigraphiée, ESR en
   place, position sur le filtre, photo. Sans relevé initial, tu ne
   sauras jamais si ton intervention a amélioré quelque chose.
3. **Ne conclus pas sur un seul chiffre.** Capacité correcte + ESR
   élevée = mort. Capacité basse + ESR correcte = mort aussi.
4. **Si le filtre a plus de quarante ans, la question n'est pas
   « lequel est mort ».** C'est « lesquels valent la peine d'être
   gardés ». Les chimiques de cette époque arrivent tous en fin de vie
   en même temps, ils ont vieilli côte à côte.

## Le débat sur le remplacement

Il n'est pas tranché, et se méfier de qui prétend le contraire.

Une partie des restaurateurs remplace les chimiques par des films
polypropylène (MKP) et rapporte un gain net de transparence. Une autre
partie considère que le MKP éloigne trop l'enceinte de sa conception
d'origine et modifie son équilibre — et remet des chimiques.

Les deux camps ont un argument valable. Le MKP a une ESR très basse et
une tolérance serrée ; il fait entendre le filtre tel qu'il a été
calculé. Mais le filtre a été calculé avec des chimiques de tolérance
±20 %, dont l'ESR faisait partie de l'équation, parfois sans que le
concepteur l'ait voulu.

Ce qui n'est pas discutable : **si tu changes de technologie, change les
deux enceintes, et note ce que tu as mis.** Une paire dépareillée en
composants de filtre est une paire dépareillée à l'écoute, et c'est
invisible six mois plus tard quand tu as oublié.

## Ce que ce guide ne dit pas

Il ne donne pas de seuil d'ESR chiffré, et c'est volontaire. La valeur
acceptable dépend de la capacité, de la tension de service et de la
technologie du condensateur — un seuil unique recopié d'un forum sur un
autre est exactement le genre de chiffre qui circule sans que personne
ne l'ait vérifié sur son propre matériel. Compare tes deux enceintes
entre elles, c'est plus solide que n'importe quelle table.
