# Atelier HiFi

Site éditorial + forum sur la restauration de matériel hi-fi français
des années 60 à 80.

> **Domaine retenu : `atelierhifi.fr`** — sans tiret. Il est câblé partout
> dans le dépôt, mais **il n'est pas encore déposé**. C'est l'étape 1 du
> `infra/RUNBOOK.md`, et rien d'autre ne peut avancer tant qu'elle n'est
> pas faite : le DNS, le certificat Let's Encrypt et la validation Brevo
> en dépendent tous.

---

## Architecture

```
atelierhifi.fr             → Astro statique (Vercel ou Cloudflare Pages)
                             Guides, fiches matériel, configurateur.
                             C'est le canal d'acquisition.

forum.atelierhifi.fr       → Discourse (Docker, VPS Hetzner CAX21)
                             C'est le canal de rétention.

cdn.atelierhifi.fr         → Cloudflare R2 (uploads + sauvegardes)
```

Sous-domaine et non sous-dossier : Discourse ne supporte officiellement
le montage en sous-dossier que pour ses clients hébergés en offre
enterprise et le déconseille en auto-hébergement. L'écart SEO est modeste,
la dette de maintenance ne l'est pas.

Le maillage compense : chaque guide renvoie vers son fil de discussion,
chaque fil renvoie vers son guide.

---

## Contenu du dépôt

```
infra/
  RUNBOOK.md            Procédure d'installation pas à pas — commence ici
  app.yml               Configuration Discourse
  setup-vps.sh          Durcissement du serveur (UFW, fail2ban, swap, Docker)
  check-backups.sh      Vérification externe des sauvegardes
  azure-staging.bicep   Instance de staging (dev/test uniquement)
  theme-discourse/      Le système de design porté sur le forum

site/                   Astro 7, TypeScript, sans framework UI
  src/styles/global.css Système de design — tokens, schéma sombre, utilitaires
  src/content.config.ts Schémas Zod des guides et des fiches matériel
  src/components/       PlaqueSignaletique = l'objet signature
  src/lib/              Calcul et plan coté du configurateur de supports
  src/pages/supports.astro  Le configurateur lui-même
  scripts/generer-og.mjs  Génère l'image de partage (npm run og)

CATEGORIES.md           Arborescence du forum + 30 sujets d'amorçage
```

---

## Démarrage local

Node 22.12 minimum — Astro 7 l'exige. Le `.node-version` à la racine est
lu par `fnm` et par la CI, il n'y a donc rien à choisir.

```bash
cd site
npm install
npm run dev      # http://localhost:4321
npm run check    # validation des types et du frontmatter
npm run build
npm run og       # régénère public/og-defaut.png
```

---

## Coût mensuel

| Poste | Montant |
| --- | --- |
| VPS Hetzner CAX21 | ~5 € |
| Cloudflare R2 | 0–1 € |
| Brevo, Cloudflare DNS, Pages | 0 € |
| Domaine .fr | ~1 €/mois amorti |

Environ **7 €/mois**. Compte personnel, pas de crédit d'entreprise : le
forum doit survivre à la fin de l'alternance.

Le crédit Azure sert au **staging uniquement** — il est réservé au
dev/test, sans SLA, et Microsoft se réserve le droit de suspendre toute
instance tournant en continu plus de 120 heures. Voir l'en-tête de
`azure-staging.bicep`.

---

## Sécurité

Aucun secret dans ce dépôt. `app.yml` est versionné avec des marqueurs
`REMPLACER_*` ; seule la copie sur le serveur est complétée.

Avant chaque commit, vérifie que rien de sensible ne part :

```bash
git diff --cached | grep -iE '(secret|password|api[_-]?key|token)'
```

`.vercel/` et `.wrangler/` sont dans le `.gitignore` — ce sont ces
dossiers qui embarquent des jetons sans qu'on s'en aperçoive.

---

## L'ordre des choses

1. Domaine, DNS, Brevo, R2 → `infra/RUNBOOK.md` §1–3
2. VPS et Discourse, en `login_required` → §4–7
3. **20 à 30 pages éditoriales sur le site** avant toute ouverture
4. Les 30 sujets d'amorçage → `CATEGORIES.md`
5. Ouverture publique → §9

Les étapes 3 et 4 sont les seules qui ne se délèguent pas. Le reste tient
en une soirée.
