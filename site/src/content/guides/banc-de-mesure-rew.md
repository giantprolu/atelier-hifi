---
titre: "Monter un banc de mesure à moins de 100 € avec REW"
resume: "Un micro USB calibré et un logiciel gratuit suffisent à mesurer une enceinte et une pièce. Ce que ça mesure vraiment, ce que ça ne mesure pas, et pourquoi le fichier de calibration est la moitié de l'investissement."
rubrique: "Mesure"
date: 2026-08-18
duree: "Une soirée de prise en main"
difficulte: "Intermédiaire"
brouillon: false
sources:
  - titre: "miniDSP UMIK-1 — page produit"
    url: "https://www.minidsp.com/products/acoustic-measurement/umik-1"
  - titre: "Getting started with REW — Room EQ Wizard"
    url: "https://www.roomeqwizard.com/help/help_en-GB/html/gettingstarted.html"
  - titre: "UMIK-1 setup with REW — miniDSP"
    url: "https://www.minidsp.com/applications/acoustic-measurements/umik-1-setup-with-rew"
  - titre: "Loudspeaker measurement with UMIK-1 and REW — miniDSP"
    url: "https://www.minidsp.com/applications/acoustic-measurements/loudspeaker-measurements"
---

Mesurer coûtait cher. Il fallait un micro de mesure, un préampli, une
carte d'acquisition et un logiciel sous licence. Aujourd'hui l'ensemble
tient dans un micro USB et un logiciel gratuit, pour un budget qui
tourne autour de 100 €.

Ça ne remplace pas une chambre anéchoïque. Mais ça remplace très
avantageusement l'oreille pour répondre aux questions qui se posent
réellement en atelier : est-ce que mes deux enceintes sont appairées ?
est-ce que mon intervention sur le filtre a fait ce que je croyais ?
est-ce que ce creux dans le grave vient de l'enceinte ou de la pièce ?

## Ce qu'il faut

**Le micro.** Un micro de mesure USB à réponse omnidirectionnelle.
L'UMIK-1 de miniDSP est la référence de fait de cette gamme de prix,
essentiellement pour une raison : il est livré avec un **fichier de
calibration individuel**, lié à son numéro de série.

Ce point mérite qu'on s'y arrête, parce que c'est là que se joue la
différence entre une mesure et une impression. Aucun micro n'est plat.
Le fichier de calibration décrit l'écart propre à **cet exemplaire**, et
le logiciel le soustrait de la mesure. Sans ce fichier, tu mesures la
somme de ton enceinte et des défauts de ton micro, sans pouvoir les
séparer.

Un micro USB sans fichier de calibration individuel — ou avec un fichier
« générique du modèle » — coûte moins cher et vaut nettement moins. Le
fichier est la moitié de ce que tu achètes.

**Le logiciel.** REW (Room EQ Wizard) est gratuit, il tourne sur les
trois systèmes, et c'est le standard de fait dans les communautés
audio. Depuis 2022 il reconnaît l'UMIK-1 comme micro USB porteur de ses
propres données de sensibilité.

**Le reste.** Un pied — un pied d'appareil photo suffit. Rien d'autre.

## Le premier réglage qui compte

Charge le fichier de calibration dans REW avant la première mesure.
C'est l'étape que tout le monde saute, et elle invalide silencieusement
tout ce qui suit : les courbes ont l'air normales, elles sont
simplement fausses d'une manière que rien ne signale.

Le fichier se télécharge chez le fabricant à partir du numéro de série
gravé sur le micro. Range-le avec le micro : le jour où tu changes
d'ordinateur, tu seras content de ne pas avoir à le rechercher.

## Ce que la mesure te donne réellement

REW envoie un balayage de fréquence et enregistre ce qui revient. À
partir de cet enregistrement il calcule la **réponse impulsionnelle** —
la signature temporelle complète du système —, puis en déduit par
transformée de Fourier la réponse en fréquence.

Ce détour par le domaine temporel n'est pas un détail théorique. C'est
ce qui rend possible la manipulation la plus utile du logiciel : le
fenêtrage.

## Le fenêtrage, et le compromis qu'il impose

Dans une pièce normale, le micro reçoit d'abord le son direct de
l'enceinte, puis les réflexions des murs, du sol et du plafond,
quelques millisecondes plus tard. La réponse brute mélange les deux : tu
mesures l'enceinte **et** la pièce.

Le fenêtrage consiste à ne garder que le début de la réponse
impulsionnelle, avant l'arrivée de la première réflexion. On obtient
alors quelque chose qui se rapproche de la réponse propre de l'enceinte.

Le compromis est incontournable, et il est purement physique : **une
fenêtre courte limite la fréquence la plus basse exploitable.** Un
fenêtrage de 6 ms ne dit plus rien en dessous d'environ 167 Hz. Pour
descendre plus bas, il faut une fenêtre plus longue, donc accepter les
réflexions, donc mesurer la pièce autant que l'enceinte.

C'est pourquoi personne ne mesure sérieusement le grave d'une enceinte
dans un salon. Le grave se mesure au ras du haut-parleur, ou en champ
proche, ou dehors. Dans une pièce, ce que tu vois en dessous de 200 Hz
est un compte-rendu de ta pièce — ce qui est une information utile, mais
ce n'est pas la même information.

## Trois mesures qui valent la peine dès le premier soir

1. **Gauche contre droite, même position de micro.** C'est la mesure la
   plus rentable de toutes, et elle ne demande aucune interprétation
   absolue : les deux courbes doivent se superposer. Un écart de
   plusieurs décibels sur une bande étroite pointe un composant de filtre
   qui a dérivé d'un côté.
2. **Avant / après intervention**, micro et niveau strictement
   identiques. C'est la seule façon honnête de savoir si un recap a fait
   quelque chose.
3. **Impédance**, si tu ajoutes une résistance de référence au montage.
   Elle révèle l'accord du coffret et la résonance du haut-parleur, deux
   choses qu'aucune écoute ne donne.

## L'erreur de débutant à éviter

Vouloir corriger la courbe. On mesure, on voit un creux à 80 Hz, on sort
l'égaliseur.

Un creux large dans le grave, dans une pièce, est presque toujours une
annulation liée à la position — enceinte et point d'écoute par rapport
aux murs. Un égaliseur ne remplit pas un creux d'annulation : il envoie
plus de puissance dans une interférence destructive, ce qui chauffe le
haut-parleur sans rien changer à ce qu'on entend. Déplace l'enceinte de
vingt centimètres et remesure avant de toucher au moindre réglage.

## Ce que ce guide ne dit pas

Il ne donne pas de procédure de placement du micro ni de niveau de
balayage, parce que ça dépend de ce que tu cherches à mesurer, et que la
documentation de REW le couvre mieux qu'un guide généraliste. Il ne cite
pas non plus de prix : ils bougent, et une somme recopiée deux ans plus
tard est fausse.
