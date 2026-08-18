# Thème Discourse — Atelier HiFi

Le pendant du système de design du site sur la seconde surface. Même
palette, même typographie, même arête de noyer sous l'en-tête : c'est ce
qui fait lire `atelierhifi.fr` et `forum.atelierhifi.fr` comme un seul
produit et non comme deux sites qui se ressemblent vaguement.

La source de vérité reste `site/src/styles/global.css`. Ce dossier en est
la traduction vers ce que Discourse sait dériver — six tokens ne
survivent pas tels quels au moteur de couleurs, et `common/common.scss`
documente lesquels et pourquoi en tête de fichier.

```
about.json              Les deux schémas de couleurs, clair et sombre
common/common.scss      Assiette, typographie, liste de sujets, boutons
common/head_tag.html    Chargement des trois fontes
```

## Pose

Le plus simple est de passer par un dépôt git : Discourse sait tirer un
thème depuis une URL et le mettre à jour d'un clic.

1. Pousse ce dossier dans un dépôt git dédié (public ou privé avec clé de
   déploiement).
2. *Admin → Personnaliser → Thèmes → Installer → Depuis un dépôt git*.
3. Colle l'URL, installe.
4. *Thèmes → Atelier HiFi → Palette de couleurs* → choisis
   « Atelier HiFi — clair », puis coche **Thème par défaut**.
5. Pour la bascule sombre automatique : *Admin → Apparence → Palette de
   couleurs sombre* → « Atelier HiFi — sombre ».

Sans dépôt git, `Installer → Depuis votre appareil` accepte une archive
ZIP de ce dossier — mais tu perds la mise à jour en un clic.

## Après chaque modification

Teste sur le staging Azure avant la production. Un thème cassé ne casse
pas le forum, mais un `common.scss` qui ne compile plus fait retomber
tout le monde sur le thème par défaut, sans prévenir.

## Ce qui reste à produire

La planche `Charte graphique` couvre l'en-tête, la plaque signalétique,
les boutons, les champs, les encarts et les tableaux. Elle ne couvre pas
encore les cinq composants propres au forum (fil de discussion, éditeur,
carte de profil, notifications, recherche) ni les états vides et de
chargement des listes. Ce fichier s'en tient donc à l'assiette générale :
il corrige ce que Discourse impose par défaut — angles arrondis, ombres,
pastilles rondes — sans redessiner des écrans qui ne sont pas spécifiés.
