/**
 * Plan coté d'un pied d'enceinte, au format SVG.
 *
 * Le fichier produit est autonome : cotes en millimètres, taille de page
 * réelle, police générique. Il s'ouvre et s'imprime tel quel chez le
 * métallier, sans dépendre du site ni d'une police téléchargée.
 *
 * Deux vues, comme sur un plan d'atelier : élévation de face à gauche,
 * vue de dessus de l'embase à droite.
 */
import type { Enceinte, Options, Resultat } from './supports';

const MARGE = 110;
const ECART_VUES = 190;
const CARTOUCHE = 120;

const TRAIT_FORT = 1.4;
const TRAIT_FIN = 0.6;
const TEXTE = 13;

const ech = (n: number) => Math.round(n).toString();

/** Échappe le texte inséré dans le SVG — les titres viennent de la saisie. */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function coteH(x1: number, x2: number, y: number, texte: string): string {
  const cx = (x1 + x2) / 2;
  return `
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" class="cote" marker-start="url(#f)" marker-end="url(#f)" />
    <line x1="${x1}" y1="${y - 8}" x2="${x1}" y2="${y + 8}" class="cote" />
    <line x1="${x2}" y1="${y - 8}" x2="${x2}" y2="${y + 8}" class="cote" />
    <text x="${cx}" y="${y - 7}" class="txt" text-anchor="middle">${texte}</text>`;
}

function coteV(y1: number, y2: number, x: number, texte: string): string {
  const cy = (y1 + y2) / 2;
  return `
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" class="cote" marker-start="url(#f)" marker-end="url(#f)" />
    <line x1="${x - 8}" y1="${y1}" x2="${x + 8}" y2="${y1}" class="cote" />
    <line x1="${x - 8}" y1="${y2}" x2="${x + 8}" y2="${y2}" class="cote" />
    <text x="${x - 7}" y="${cy}" class="txt" text-anchor="middle"
          transform="rotate(-90 ${x - 7} ${cy})">${texte}</text>`;
}

/** Ligne d'attache : un trait brisé et une étiquette. */
function repere(x: number, y: number, vers: number, haut: number, texte: string): string {
  const sens = vers > x ? 1 : -1;
  return `
    <polyline points="${x},${y} ${vers},${haut} ${vers + sens * 26},${haut}" class="attache" />
    <circle cx="${x}" cy="${y}" r="2.4" class="plein" />
    <text x="${vers + sens * 31}" y="${haut + 4.5}" class="txt"
          text-anchor="${sens > 0 ? 'start' : 'end'}">${texte}</text>`;
}

export function tracerPlan(e: Enceinte, o: Options, r: Resultat): string {
  const H1 = r.hauteur + e.hauteur;
  const W1 = Math.max(r.embase.largeur, e.largeur);
  const W2 = r.embase.largeur;
  const H2 = r.embase.profondeur;

  const zoneH = Math.max(H1, H2);
  const zoneW = W1 + ECART_VUES + W2;

  const L = zoneW + 2 * MARGE;
  const Htot = zoneH + 2 * MARGE + CARTOUCHE;

  const sol = MARGE + zoneH;
  const y = (h: number) => sol - h;

  /* --- Élévation de face -------------------------------------------- */

  const cx = MARGE + W1 / 2;
  const a = r.colonne.cote;
  const interieur = a - 2 * r.colonne.epaisseur;

  // Sol hachuré, comme sur un plan de menuiserie.
  const hachures = Array.from({ length: 22 }, (_, i) => {
    const x = MARGE - 34 + i * ((W1 + 68) / 21);
    return `<line x1="${ech(x)}" y1="${sol}" x2="${ech(x - 11)}" y2="${sol + 11}" class="fin" />`;
  }).join('');

  const pointe = (px: number) =>
    `<polygon points="${px - 7},${y(0)} ${px + 7},${y(0)} ${px},${y(-13)}" class="fin" fill="none" />`;

  const elevation = `
    <g>
      <line x1="${MARGE - 34}" y1="${sol}" x2="${MARGE + W1 + 34}" y2="${sol}" class="fort" />
      ${hachures}

      ${pointe(cx - r.embase.largeur / 2 + 25)}
      ${pointe(cx + r.embase.largeur / 2 - 25)}

      <rect x="${cx - r.embase.largeur / 2}" y="${y(r.embase.epaisseur)}"
            width="${r.embase.largeur}" height="${r.embase.epaisseur}" class="fort" />

      <rect x="${cx - a / 2}" y="${y(r.embase.epaisseur + r.longueurColonne)}"
            width="${a}" height="${r.longueurColonne}" class="fort" />
      <line x1="${cx - interieur / 2}" y1="${y(r.embase.epaisseur + r.longueurColonne)}"
            x2="${cx - interieur / 2}" y2="${y(r.embase.epaisseur)}" class="cache" />
      <line x1="${cx + interieur / 2}" y1="${y(r.embase.epaisseur + r.longueurColonne)}"
            x2="${cx + interieur / 2}" y2="${y(r.embase.epaisseur)}" class="cache" />

      <rect x="${cx - r.platine.largeur / 2}" y="${y(r.hauteur)}"
            width="${r.platine.largeur}" height="${r.platine.epaisseur}" class="fort" />

      <rect x="${cx - e.largeur / 2}" y="${y(r.hauteur + e.hauteur)}"
            width="${e.largeur}" height="${e.hauteur}" class="cache" />
      <circle cx="${cx}" cy="${y(r.hauteur + e.hauteurTweeter)}" r="26" class="cache" />
      <line x1="${cx - 34}" y1="${y(r.hauteur + e.hauteurTweeter)}"
            x2="${cx + 34}" y2="${y(r.hauteur + e.hauteurTweeter)}" class="axe" />

      <line x1="${MARGE - 34}" y1="${y(o.hauteurOreille)}"
            x2="${MARGE + W1 + 60}" y2="${y(o.hauteurOreille)}" class="axe" />
      <text x="${MARGE + W1 + 64}" y="${y(o.hauteurOreille) - 6}" class="txt">
        oreille ${ech(o.hauteurOreille)}
      </text>

      ${coteV(y(r.hauteur), y(0), MARGE - 52, `${ech(r.hauteur)} hauteur pied`)}
      ${coteV(
        y(r.embase.epaisseur + r.longueurColonne),
        y(r.embase.epaisseur),
        MARGE + W1 + 52,
        `${ech(r.longueurColonne)} coupe tube`,
      )}
      ${coteH(cx - r.embase.largeur / 2, cx + r.embase.largeur / 2, sol + 62, ech(r.embase.largeur))}

      ${repere(
        cx + a / 2,
        y(r.embase.epaisseur + r.longueurColonne / 2),
        cx + W1 / 2 + 100,
        y(r.embase.epaisseur + r.longueurColonne / 2) + 30,
        `Tube ${a}×${a}×${r.colonne.epaisseur}`,
      )}
      ${repere(
        cx + r.platine.largeur / 2,
        y(r.hauteur) + r.platine.epaisseur / 2,
        cx + W1 / 2 + 100,
        y(r.hauteur) - 34,
        `Platine ${r.platine.epaisseur} — ${r.platine.largeur}×${r.platine.profondeur}`,
      )}
      ${repere(
        cx - r.embase.largeur / 2,
        y(r.embase.epaisseur / 2),
        MARGE - 96,
        y(0) + 46,
        `Embase ${r.embase.epaisseur}`,
      )}
    </g>`;

  /* --- Vue de dessus de l'embase ------------------------------------ */

  const x2 = MARGE + W1 + ECART_VUES;
  const y2 = sol - H2;
  const c2x = x2 + W2 / 2;
  const c2y = y2 + H2 / 2;
  const RETRAIT_TROU = 25;

  const trous = [
    [x2 + RETRAIT_TROU, y2 + RETRAIT_TROU],
    [x2 + W2 - RETRAIT_TROU, y2 + RETRAIT_TROU],
    [x2 + RETRAIT_TROU, y2 + H2 - RETRAIT_TROU],
    [x2 + W2 - RETRAIT_TROU, y2 + H2 - RETRAIT_TROU],
  ]
    .map(
      ([tx, ty]) => `
      <circle cx="${ech(tx!)}" cy="${ech(ty!)}" r="4.5" class="fort" fill="none" />
      <line x1="${ech(tx! - 11)}" y1="${ech(ty!)}" x2="${ech(tx! + 11)}" y2="${ech(ty!)}" class="axe" />
      <line x1="${ech(tx!)}" y1="${ech(ty! - 11)}" x2="${ech(tx!)}" y2="${ech(ty! + 11)}" class="axe" />`,
    )
    .join('');

  const dessus = `
    <g>
      <rect x="${x2}" y="${y2}" width="${W2}" height="${H2}" class="fort" />
      <rect x="${c2x - a / 2}" y="${c2y - a / 2}" width="${a}" height="${a}" class="cache" />
      ${trous}

      <line x1="${x2 - 22}" y1="${c2y}" x2="${x2 + W2 + 22}" y2="${c2y}" class="axe" />
      <line x1="${c2x}" y1="${y2 - 22}" x2="${c2x}" y2="${y2 + H2 + 22}" class="axe" />

      ${coteH(x2, x2 + W2, sol + 62, ech(W2))}
      ${coteH(x2, x2 + RETRAIT_TROU, y2 - 30, ech(RETRAIT_TROU))}
      ${coteV(y2, y2 + H2, x2 + W2 + 62, ech(H2))}

      <text x="${c2x}" y="${y2 - 62}" class="txt" text-anchor="middle">
        EMBASE — VUE DE DESSUS — 4 × M8
      </text>
    </g>`;

  /* --- Cartouche ----------------------------------------------------- */

  const cy0 = Htot - CARTOUCHE + 20;
  const titre = `PIED D'ENCEINTE — ${ech(e.largeur)} × ${ech(e.profondeur)} × ${ech(e.hauteur)} mm, ${e.masse} kg`;

  const cartouche = `
    <g>
      <rect x="${MARGE - 52}" y="${cy0}" width="${L - 2 * MARGE + 104}" height="${CARTOUCHE - 40}" class="fin" fill="none" />
      <text x="${MARGE - 34}" y="${cy0 + 30}" class="titre">${esc(titre)}</text>
      <text x="${MARGE - 34}" y="${cy0 + 56}" class="txt">
        Cotes en millimètres · Tolérance générale ± 1 mm · Acier S235 · Angle de basculement ${r.angleBasculement.toFixed(1)}°
      </text>
      <text x="${L - MARGE + 34}" y="${cy0 + 30}" class="titre" text-anchor="end">atelierhifi.fr</text>
      <text x="${L - MARGE + 34}" y="${cy0 + 56}" class="txt" text-anchor="end">
        Masse par pied ${r.massePied.toFixed(1)} kg
      </text>
    </g>`;

  /* --- Assemblage ----------------------------------------------------- */

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ech(L)}mm" height="${ech(Htot)}mm"
     viewBox="0 0 ${ech(L)} ${ech(Htot)}" role="img"
     aria-label="Plan coté du pied d'enceinte : élévation de face et vue de dessus de l'embase">
  <title>${esc(titre)}</title>
  <defs>
    <marker id="f" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto">
      <path d="M 0 6 L 12 2 L 12 10 z" fill="#111" />
    </marker>
  </defs>
  <style>
    rect, line, polyline, polygon, circle { fill: none; }
    .fort  { stroke: #111; stroke-width: ${TRAIT_FORT}; }
    .fin   { stroke: #111; stroke-width: ${TRAIT_FIN}; }
    .cache { stroke: #111; stroke-width: ${TRAIT_FIN}; stroke-dasharray: 9 6; }
    .axe   { stroke: #111; stroke-width: ${TRAIT_FIN}; stroke-dasharray: 22 5 4 5; }
    .cote  { stroke: #111; stroke-width: ${TRAIT_FIN}; }
    .attache { stroke: #111; stroke-width: ${TRAIT_FIN}; }
    .plein { fill: #111; stroke: none; }
    text   { font-family: ui-monospace, 'IBM Plex Mono', 'Consolas', monospace;
             font-size: ${TEXTE}px; fill: #111; }
    .titre { font-size: ${TEXTE + 3}px; font-weight: 600; }
  </style>
  <rect x="0" y="0" width="${ech(L)}" height="${ech(Htot)}" fill="#ffffff" />
  ${elevation}
  ${dessus}
  ${cartouche}
</svg>`;
}
