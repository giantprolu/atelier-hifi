/**
 * Génère public/og-defaut.png — 1200×630, l'image partagée par défaut.
 *
 *   npm run og
 *
 * Pourquoi un script et pas un PNG posé là une fois pour toutes : le jour
 * où la accroche change, l'image doit suivre. Un binaire dont personne ne
 * sait comment il a été fabriqué ne se met jamais à jour.
 *
 * Deux moteurs, chacun pour ce qu'il fait bien :
 *   - le fond (métal brossé, reflet, vis, témoin) est un SVG rendu par
 *     sharp — motifs répétés et dégradés radiaux y sont fiables ;
 *   - le texte passe par satori, avec les fichiers de police fournis
 *     explicitement. Aucune dépendance aux polices du système, donc un
 *     rendu identique sur ta machine et sur un runner CI.
 *
 * Les polices sont téléchargées une fois dans scripts/.polices/
 * (ignoré par git) plutôt que versionnées.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import satori from 'satori';
import sharp from 'sharp';

const L = 1200;
const H = 630;

const ARDOISE = '#22262b';
const ALU = '#dcdeda';
const PAPIER = '#f0f1ee';
const TEMOIN = '#e09a2b';

const SORTIE = new URL('../public/og-defaut.png', import.meta.url);
const CACHE = new URL('./.polices/', import.meta.url);

/* ---------- Polices ------------------------------------------------ */

/**
 * L'API css2 de Google Fonts renvoie des URL .ttf quand on se présente
 * avec un vieil agent utilisateur — les navigateurs récents reçoivent du
 * woff2, que satori ne lit pas.
 */
const POLICES = [
  {
    fichier: 'Archivo-Bold.ttf',
    css: 'https://fonts.googleapis.com/css2?family=Archivo:wght@700',
  },
  {
    fichier: 'IBMPlexMono-Medium.ttf',
    css: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500',
  },
];

async function police({ fichier, css }) {
  const chemin = new URL(fichier, CACHE);
  if (existsSync(chemin)) return readFile(chemin);

  await mkdir(CACHE, { recursive: true });
  console.log(`Téléchargement de ${fichier}…`);

  const feuille = await fetch(css, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)' },
  }).then((r) => r.text());

  const url = feuille.match(/url\((https:\/\/[^)]+\.ttf)\)/)?.[1];
  if (!url) throw new Error(`Pas d'URL .ttf trouvée pour ${fichier}`);

  const data = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
  await writeFile(chemin, data);
  return data;
}

const [archivo, mono] = await Promise.all(POLICES.map(police));

/* ---------- Fond : la plaque elle-même ------------------------------ */

const vis = (x, y) => `
  <circle cx="${x}" cy="${y}" r="7" fill="url(#vis)" />
  <circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="1" />`;

const fond = `
<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}">
  <defs>
    <!-- Brossage : un trait de 1px tous les 4px, même pas que la plaque
         signalétique du site. À la limite du perceptible — si on la voit,
         c'est raté. -->
    <pattern id="brosse" width="4" height="1" patternUnits="userSpaceOnUse">
      <rect width="1" height="1" fill="#ffffff" fill-opacity="0.035" />
    </pattern>
    <linearGradient id="reflet" x1="0" y1="0" x2="1" y2="0.55">
      <stop offset="0%"   stop-color="#ffffff" stop-opacity="0.075" />
      <stop offset="42%"  stop-color="#ffffff" stop-opacity="0" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05" />
    </linearGradient>
    <radialGradient id="vis" cx="0.35" cy="0.35" r="0.75">
      <stop offset="0%"   stop-color="#6a7078" />
      <stop offset="100%" stop-color="#2b3037" />
    </radialGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%"   stop-color="${TEMOIN}" stop-opacity="0.55" />
      <stop offset="100%" stop-color="${TEMOIN}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${L}" height="${H}" fill="${ARDOISE}" />
  <rect width="${L}" height="${H}" fill="url(#brosse)" />
  <rect width="${L}" height="${H}" fill="url(#reflet)" />

  <!-- Liseré supérieur : l'arête éclairée d'une façade. -->
  <rect x="0" y="0" width="${L}" height="1" fill="#ffffff" fill-opacity="0.12" />

  ${vis(30, 30)} ${vis(L - 30, 30)} ${vis(30, H - 30)} ${vis(L - 30, H - 30)}

  <!-- Témoin ambré, calé sur la ligne de la baseline : 72 de padding
       + 36 de hauteur de ligne du titre + 12 de marge + la moitié des
       18 de la baseline. -->
  <circle cx="88" cy="129" r="24" fill="url(#halo)" />
  <circle cx="88" cy="129" r="5.5" fill="${TEMOIN}" />
</svg>`;

/* ---------- Texte --------------------------------------------------- */

const div = (style, children) => ({ type: 'div', props: { style, children } });
const txt = (style, s) => div({ display: 'flex', ...style }, s);

const gabarit = div(
  {
    width: L,
    height: H,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '72px 76px',
    fontFamily: 'Archivo',
    color: ALU,
  },
  [
    // Bloc de marque. Le témoin ambré du fond se place à gauche de la
    // baseline, d'où le retrait de 34px sur celle-ci seulement.
    div({ display: 'flex', flexDirection: 'column' }, [
      txt({ fontSize: 30, fontWeight: 700, letterSpacing: 11, color: PAPIER }, 'ATELIER HIFI'),
      txt(
        {
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 4.5,
          color: TEMOIN,
          marginTop: 12,
          marginLeft: 34,
        },
        'RESTAURATION & FABRICATION',
      ),
    ]),

    div({ display: 'flex', flexDirection: 'column' }, [
      // Coupure de ligne explicite : au retour automatique, « années »
      // et « 70 » se retrouvent séparés.
      div(
        {
          display: 'flex',
          flexDirection: 'column',
          fontSize: 60,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: -1.2,
          color: PAPIER,
        },
        [txt({}, 'Le matériel français'), txt({}, 'des années 70 n’est pas mort.')],
      ),
      txt(
        {
          fontFamily: 'IBMPlexMono',
          fontSize: 21,
          letterSpacing: 0.2,
          color: 'rgba(220,222,218,0.62)',
          marginTop: 22,
        },
        'Il a juste besoin de condensateurs neufs.',
      ),
    ]),

    div(
      {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderTop: '1px solid rgba(255,255,255,0.18)',
        paddingTop: 22,
      },
      [
        txt(
          {
            fontFamily: 'IBMPlexMono',
            fontSize: 15,
            letterSpacing: 1.6,
            color: 'rgba(220,222,218,0.5)',
          },
          'SIARE · CABASSE · ELIPSON · AUDAX · SUPRAVOX',
        ),
        txt({ fontFamily: 'IBMPlexMono', fontSize: 19, color: TEMOIN }, 'atelierhifi.fr'),
      ],
    ),
  ],
);

const svgTexte = await satori(gabarit, {
  width: L,
  height: H,
  fonts: [
    { name: 'Archivo', data: archivo, weight: 700, style: 'normal' },
    { name: 'IBMPlexMono', data: mono, weight: 500, style: 'normal' },
  ],
});

/* ---------- Composition --------------------------------------------- */

const png = await sharp(Buffer.from(fond))
  .composite([{ input: Buffer.from(svgTexte), top: 0, left: 0 }])
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(SORTIE, png);
console.log(`Écrit : public/og-defaut.png — ${L}×${H}, ${Math.round(png.length / 1024)} Ko`);
