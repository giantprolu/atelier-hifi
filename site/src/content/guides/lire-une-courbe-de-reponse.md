---
titre: "Lire une courbe de réponse sans se raconter d'histoires"
resume: "Le lissage, l'échelle et le fenêtrage décident de ce que la courbe montre — avant même que l'enceinte n'ait son mot à dire. Comment reconnaître une courbe qu'on a rendue jolie, y compris la sienne."
rubrique: "Mesure"
date: 2026-08-18
duree: "Une heure"
difficulte: "Intermédiaire"
brouillon: false
sources:
  - titre: "Graph menu — Room EQ Wizard"
    url: "https://www.roomeqwizard.com/help/help_en-GB/html/graph.html"
  - titre: "Impulse responses — Room EQ Wizard"
    url: "https://www.roomeqwizard.com/help/help_en-GB/html/impulseresponse.html"
  - titre: "Signals and measurements — Room EQ Wizard"
    url: "https://www.roomeqwizard.com/help/help_en-GB/html/primer.html"
  - titre: "Gating in REW: does it lie to us? — diyAudio"
    url: "https://www.diyaudio.com/community/threads/gating-in-rew-does-it-lie-to-us.432941/"
---

Une courbe de réponse en fréquence n'est pas une photographie. C'est un
tracé qui dépend d'au moins quatre réglages faits par celui qui l'a
produite, et dont trois ne sont presque jamais indiqués à côté du
graphique.

Ça vaut pour les courbes de constructeurs, pour celles des magazines, et
surtout pour les tiennes. La question n'est pas « est-ce que la courbe
ment » — c'est « qu'est-ce que j'ai demandé à cette courbe de me
montrer ».

## 1. Le lissage

C'est le réglage qui transforme le plus une courbe, et le moins signalé.

Une réponse brute, non lissée, est hérissée de pics et de creux étroits.
Le lissage moyenne le tracé sur une largeur de bande donnée, exprimée en
fractions d'octave. Plus la fraction est large, plus la courbe est
propre.

| Lissage | Ce que ça donne |
| --- | --- |
| Aucun | Illisible en pièce, mais honnête |
| 1/12 d'octave | Détaillé, on voit encore les résonances étroites |
| 1/6 d'octave | Le compromis courant pour du plein spectre |
| 1/3 d'octave | Lisse, adapté au grave |
| 1 octave | Une courbe qui ne peut plus être mauvaise |

REW propose aussi un lissage dit psychoacoustique, qui varie selon la
fréquence — plus large dans le grave, plus fin dans l'aigu — pour se
rapprocher de la façon dont l'oreille intègre.

**Ce qu'il faut en retenir :** un lissage large fait disparaître les
accidents étroits. Une résonance de coffret bien marquée, très visible
sans lissage, devient une ondulation anodine en 1/3 d'octave. Ce n'est
pas de la triche en soi — c'est de la triche quand on ne le dit pas.

**La règle honnête :** indique toujours le lissage à côté de la courbe,
et compare des courbes lissées de la même façon. Une comparaison
avant/après faite à deux lissages différents ne veut strictement rien
dire.

## 2. L'échelle verticale

Le second levier, tout aussi efficace.

Une courbe tracée sur 50 dB de hauteur d'axe paraît plate. La même
courbe sur 20 dB montre tous ses défauts. Les deux sont exactes.

La convention raisonnable est une échelle de 50 dB au total —
typiquement de 45 à 95 dB — avec des graduations tous les 5 dB. Dès
qu'une courbe publiée paraît remarquablement plate, regarde l'axe
vertical avant d'admirer.

## 3. Le fenêtrage

En pièce, le micro capte le son direct puis les réflexions. Le fenêtrage
ne garde que le début de la réponse impulsionnelle pour approcher la
réponse propre de l'enceinte.

Le compromis est physique et non négociable : **une fenêtre courte
supprime les réflexions mais perd le grave.** Un fenêtrage de 6 ms ne
donne plus d'information exploitable en dessous d'environ 167 Hz.

Conséquence directe : une courbe fenêtrée qui affiche fièrement une
réponse jusqu'à 30 Hz est incohérente avec elle-même. Soit la fenêtre est
longue et on regarde la pièce, soit elle est courte et le grave affiché
est une extrapolation.

## 4. La position du micro

Déplacer le micro de vingt centimètres dans une pièce change la courbe
plus que la plupart des modifications qu'on fait sur une enceinte. Dans
le grave, les creux d'annulation se déplacent complètement.

D'où deux pratiques :
- Pour comparer deux enceintes ou un avant/après, **ne bouge rien**.
  Marque la position du micro au sol.
- Pour caractériser une pièce, fais au contraire plusieurs positions
  autour du point d'écoute et moyenne-les. Une mesure unique en un point
  décrit ce point, pas la pièce.

## Lire ce qui compte vraiment

Ce que la courbe dit bien :

- **L'écart entre deux enceintes.** Superposées, elles doivent se
  suivre. Un écart net et localisé pointe un composant.
- **Un accident large et reproductible** : une bosse de 6 dB sur une
  octave s'entend et se corrige.
- **Le point de coupure du filtre**, sur une mesure par voie.
- **L'effet d'une intervention**, à condition que tout le reste soit
  identique.

Ce que la courbe dit mal ou pas du tout :

- **Le comportement temporel.** Deux enceintes de réponse en fréquence
  identique peuvent sonner différemment. La courbe ne dit rien du temps
  de décroissance des résonances — pour ça, il faut regarder la chute
  spectrale, pas la réponse.
- **La distorsion.** C'est une mesure séparée.
- **Le grave dans une pièce**, sans précaution particulière. En dessous
  de 200 Hz, tu mesures d'abord ta pièce.
- **Ce qui est agréable.** Une courbe rigoureusement plate en pièce
  passe généralement pour agressive. La cible admise décroît doucement
  du grave vers l'aigu.

## Le réflexe qui évite de se mentir

Avant de conclure quoi que ce soit d'une courbe — la tienne ou celle
d'un autre —, pose-toi quatre questions :

1. Quel lissage ?
2. Quelle échelle verticale ?
3. Fenêtré ou non, et à quelle durée ?
4. Quelle position de micro, et une seule ou plusieurs ?

Sans ces quatre réponses, la courbe est une illustration, pas une
mesure. Et si tu publies les tiennes, donne les quatre : c'est ce qui
distingue un relevé d'une capture d'écran.

## Ce que ce guide ne dit pas

Il ne propose pas de courbe cible. C'est un sujet où les avis divergent
légitimement selon la pièce, la distance d'écoute et le goût, et une
cible unique donnée comme vérité serait exactement le genre d'affirmation
que ce guide invite à questionner.
