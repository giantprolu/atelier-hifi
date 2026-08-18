/**
 * Dimensionnement d'un pied d'enceinte en acier soudé.
 *
 * Le calcul suit l'ordre dans lequel on conçoit réellement un pied :
 *
 *   1. la hauteur découle de l'écoute — tweeter à hauteur d'oreille ;
 *   2. la section de la colonne découle de la masse et de la hauteur ;
 *   3. l'embase découle de la stabilité au basculement, calculée à partir
 *      du centre de gravité réel de l'ensemble (pied + lestage + enceinte)
 *      et non d'une règle de pouce.
 *
 * Toutes les longueurs sont en millimètres, toutes les masses en
 * kilogrammes. Une seule unité par grandeur, jamais de conversion cachée
 * en cours de route : c'est là que se logent les erreurs de facteur 10.
 */

export interface Enceinte {
  largeur: number;
  profondeur: number;
  hauteur: number;
  masse: number;
  /** Axe du tweeter, mesuré depuis le dessous de l'enceinte. */
  hauteurTweeter: number;
}

export interface Options {
  /** Hauteur d'oreille en position d'écoute assise. */
  hauteurOreille: number;
  /** Lestage de la colonne au sable sec. */
  sable: boolean;
}

export interface Section {
  cote: number;
  epaisseur: number;
}

export interface LigneNomenclature {
  designation: string;
  quantite: string;
  detail?: string;
}

export interface Resultat {
  /** Hauteur hors tout du pied, sol → dessus de la platine. */
  hauteur: number;
  colonne: Section;
  /** Longueur de coupe du tube, platines déduites. */
  longueurColonne: number;
  platine: { largeur: number; profondeur: number; epaisseur: number };
  embase: { largeur: number; profondeur: number; epaisseur: number };
  masseAcier: number;
  masseSable: number;
  /** Masse d'un pied équipé, lestage compris. */
  massePied: number;
  /** Hauteur du centre de gravité de l'ensemble pied + enceinte. */
  centreGravite: number;
  /** Angle de basculement. En dessous de 12°, l'ensemble est jugé instable. */
  angleBasculement: number;
  alertes: string[];
}

const RHO_ACIER = 7.85e-6; // kg/mm³
const RHO_SABLE = 1.5e-6; // kg/mm³, sable de quartz sec

/** Remplissage réel : on ne tasse jamais un tube jusqu'au ras. */
const TAUX_REMPLISSAGE = 0.9;

/** Angle de basculement visé. En dessous, un coup de pied dans l'embase suffit. */
const ANGLE_CIBLE = 12;

/** Retrait de la platine sous l'enceinte, par côté : elle doit disparaître. */
const RETRAIT_PLATINE = 5;

/** Débord minimal de l'embase autour de l'empreinte de l'enceinte. */
const DEBORD_EMBASE = 10;

/**
 * Sections courantes en tube carré, du plus léger au plus lourd.
 * On prend la première qui encaisse à la fois la masse et la hauteur :
 * un pied haut fléchit avant de céder, d'où le double critère.
 */
const SECTIONS: Array<Section & { masseMax: number; hauteurMax: number }> = [
  { cote: 60, epaisseur: 2, masseMax: 8, hauteurMax: 650 },
  { cote: 80, epaisseur: 3, masseMax: 18, hauteurMax: 800 },
  { cote: 100, epaisseur: 3, masseMax: Infinity, hauteurMax: Infinity },
];

const arrondi = (v: number, pas: number) => Math.round(v / pas) * pas;
const borne = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

function sectionColonne(masse: number, hauteur: number): Section {
  const s =
    SECTIONS.find((c) => masse <= c.masseMax && hauteur <= c.hauteurMax) ??
    SECTIONS[SECTIONS.length - 1]!;
  return { cote: s.cote, epaisseur: s.epaisseur };
}

/**
 * Épaisseurs de tôle. L'embase est toujours plus épaisse que la platine :
 * elle encaisse le poids et sert de masse basse.
 */
function epaisseurs(masse: number): { platine: number; embase: number } {
  if (masse <= 10) return { platine: 6, embase: 8 };
  if (masse <= 20) return { platine: 8, embase: 10 };
  return { platine: 8, embase: 12 };
}

const masseTube = (s: Section, longueur: number) =>
  (s.cote ** 2 - (s.cote - 2 * s.epaisseur) ** 2) * longueur * RHO_ACIER;

const masseTole = (l: number, p: number, e: number) => l * p * e * RHO_ACIER;

export function calculer(enceinte: Enceinte, options: Options): Resultat {
  const alertes: string[] = [];

  /* --- 1. Hauteur : c'est l'écoute qui commande ---------------------- */

  const hauteurIdeale = options.hauteurOreille - enceinte.hauteurTweeter;
  const hauteur = arrondi(borne(hauteurIdeale, 120, 900), 5);

  if (hauteurIdeale < 120) {
    alertes.push(
      `Le tweeter arrive déjà à ${Math.round(enceinte.hauteurTweeter)} mm du sol de l'enceinte : ` +
        `un pied de ${Math.round(hauteurIdeale)} mm serait nécessaire, ce qui n'a pas de sens. ` +
        `Cette enceinte demande une simple embase de découplage, ou une position d'écoute plus haute.`,
    );
  } else if (hauteurIdeale > 900) {
    alertes.push(
      `Un pied de ${Math.round(hauteurIdeale)} mm sort du domaine raisonnable pour de l'acier soudé. ` +
        `Vérifie la hauteur de tweeter saisie, ou revois la position d'écoute.`,
    );
  }

  /* --- 2. Colonne et tôles ------------------------------------------- */

  const colonne = sectionColonne(enceinte.masse, hauteur);
  const ep = epaisseurs(enceinte.masse);
  const longueurColonne = hauteur - ep.platine - ep.embase;

  const platine = {
    largeur: arrondi(
      borne(enceinte.largeur - 2 * RETRAIT_PLATINE, colonne.cote + 20, enceinte.largeur),
      5,
    ),
    profondeur: arrondi(
      borne(enceinte.profondeur - 2 * RETRAIT_PLATINE, colonne.cote + 20, enceinte.profondeur),
      5,
    ),
    epaisseur: ep.platine,
  };

  /* --- 3. Embase : dimensionnée par la stabilité --------------------- */

  // Le centre de gravité dépend de la taille de l'embase, qui dépend
  // elle-même du centre de gravité. On converge en quelques passes plutôt
  // que de résoudre analytiquement — c'est monotone, ça tient en dix tours.
  const volumeInterieur =
    (colonne.cote - 2 * colonne.epaisseur) ** 2 * longueurColonne * TAUX_REMPLISSAGE;
  const masseSable = options.sable ? volumeInterieur * RHO_SABLE : 0;
  const masseColonne = masseTube(colonne, longueurColonne);
  const massePlatine = masseTole(platine.largeur, platine.profondeur, platine.epaisseur);

  let largeurEmbase = arrondi(enceinte.largeur + 2 * DEBORD_EMBASE, 10);
  let profondeurEmbase = arrondi(enceinte.profondeur + 2 * DEBORD_EMBASE, 10);
  let centreGravite = 0;
  let angleBasculement = 0;

  for (let i = 0; i < 30; i++) {
    const masseEmbase = masseTole(largeurEmbase, profondeurEmbase, ep.embase);

    // Hauteurs des centres de gravité élémentaires, depuis le sol.
    const zEmbase = ep.embase / 2;
    const zColonne = ep.embase + longueurColonne / 2;
    const zPlatine = hauteur - platine.epaisseur / 2;
    const zEnceinte = hauteur + enceinte.hauteur / 2;

    const total = masseEmbase + masseColonne + masseSable + massePlatine + enceinte.masse;
    centreGravite =
      (masseEmbase * zEmbase +
        masseColonne * zColonne +
        masseSable * zColonne +
        massePlatine * zPlatine +
        enceinte.masse * zEnceinte) /
      total;

    // Basculement sur l'arête la plus proche : c'est la plus petite
    // dimension de l'embase qui décide.
    const demiBase = Math.min(largeurEmbase, profondeurEmbase) / 2;
    angleBasculement = (Math.atan(demiBase / centreGravite) * 180) / Math.PI;

    if (angleBasculement >= ANGLE_CIBLE || largeurEmbase >= 520) break;

    largeurEmbase += 10;
    profondeurEmbase += 10;
  }

  if (angleBasculement < ANGLE_CIBLE) {
    alertes.push(
      `Stabilité limite : ${angleBasculement.toFixed(1)}° de basculement pour ${ANGLE_CIBLE}° visés, ` +
        `même avec une embase de ${largeurEmbase} mm. Une enceinte haute et lourde sur un pied haut ` +
        `atteint les limites du principe. Lester au plomb plutôt qu'au sable, ou fixer l'enceinte au mur.`,
    );
  }

  if (!options.sable && enceinte.masse > 10) {
    alertes.push(
      `Sans lestage, un pied de cette taille sonne comme une cloche et remonte les vibrations ` +
        `dans l'enceinte. Le sable sec est ce qui coûte le moins cher au kilo de stabilité gagné.`,
    );
  }

  const embase = {
    largeur: largeurEmbase,
    profondeur: profondeurEmbase,
    epaisseur: ep.embase,
  };

  const masseAcier =
    masseColonne + massePlatine + masseTole(embase.largeur, embase.profondeur, embase.epaisseur);

  return {
    hauteur,
    colonne,
    longueurColonne,
    platine,
    embase,
    masseAcier,
    masseSable,
    massePied: masseAcier + masseSable,
    centreGravite,
    angleBasculement,
    alertes,
  };
}

/**
 * Nomenclature pour la paire. Un pied seul ne sert à rien, et le
 * métallier chiffre au débit total : autant lui donner les quantités
 * qu'il va reporter sur son devis.
 */
export function nomenclature(r: Resultat, options: Options): LigneNomenclature[] {
  const lignes: LigneNomenclature[] = [
    {
      designation: `Tube acier carré ${r.colonne.cote} × ${r.colonne.cote} × ${r.colonne.epaisseur} mm`,
      quantite: `2 × ${r.longueurColonne} mm`,
      detail: `Coupes d'équerre aux deux bouts. Le défaut d'équerrage se rattrape mal une fois soudé.`,
    },
    {
      designation: `Tôle acier ${r.platine.epaisseur} mm — platine supérieure`,
      quantite: `2 × ${r.platine.largeur} × ${r.platine.profondeur} mm`,
      detail: `Retrait de ${RETRAIT_PLATINE} mm par côté sous l'enceinte : la platine ne doit pas dépasser.`,
    },
    {
      designation: `Tôle acier ${r.embase.epaisseur} mm — embase`,
      quantite: `2 × ${r.embase.largeur} × ${r.embase.profondeur} mm`,
      detail: `Dimensionnée pour ${r.angleBasculement.toFixed(1)}° de basculement.`,
    },
    {
      designation: 'Écrou à souder M8',
      quantite: '8',
      detail: 'Quatre par embase, soudés en sous-face avant peinture.',
    },
    {
      designation: 'Pointe de découplage M8 + contre-écrou',
      quantite: '8',
      detail: 'Le réglage de niveau se fait par les pointes, pas par des cales.',
    },
  ];

  if (options.sable) {
    lignes.push({
      designation: 'Sable de quartz sec, tamisé',
      quantite: `${(r.masseSable * 2).toFixed(1)} kg`,
      detail:
        'Sable de silice pour filtration de piscine : sec, calibré, sans poussière. ' +
        'Séchage au four avant remplissage, sinon la rouille travaille de l’intérieur.',
    });
    lignes.push({
      designation: 'Bouchon de remplissage — tôle ou PVC',
      quantite: '2',
      detail: 'À percer dans la platine supérieure avant soudure, pas après.',
    });
  }

  return lignes;
}
