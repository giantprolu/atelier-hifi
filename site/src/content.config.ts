import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Content Layer API. Le fichier vit à la racine de src/ (et non plus
 * dans src/content/).
 *
 * `z` vient de 'astro/zod' et non de 'astro:content' : le ré-export
 * depuis 'astro:content' est déprécié depuis Astro 7.
 */

/**
 * Plaque signalétique — partagée par les guides et les fiches matériel.
 * Un seul schéma pour un seul composant : si un champ bouge, il bouge
 * pour les deux collections en même temps.
 */
const plaque = z.object({
  marque: z.string(),
  modele: z.string(),
  annees: z.string().optional(),
  lignes: z.array(
    z.object({
      label: z.string(),
      valeur: z.string(),
    }),
  ),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    titre: z.string(),
    resume: z.string(),
    rubrique: z.enum([
      'Enceintes',
      'Amplification',
      'Sources',
      'Fabrication',
      'Mesure',
    ]),
    date: z.coerce.date(),
    misAJour: z.coerce.date().optional(),
    duree: z.string().optional(),
    difficulte: z.enum(['Accessible', 'Intermédiaire', 'Avancé']).optional(),
    brouillon: z.boolean().default(false),

    // Sujet Discourse associé. Renseigné après ouverture du forum :
    // chaque guide pointe vers son fil de discussion, et le fil pointe
    // vers le guide. C'est ce maillage qui fait circuler l'autorité
    // entre le site et le sous-domaine.
    sujetForum: z.url().optional(),

    // Fiches matériel concernées par ce guide, par identifiant de fichier
    // (« siare-cl240 »). Le lien inverse est calculé automatiquement :
    // une fiche liste les guides qui la citent, sans double saisie.
    fiches: z.array(z.string()).default([]),

    // Alimente le composant PlaqueSignaletique.
    plaque: plaque.optional(),
  }),
});

/**
 * Fiches matériel — le pendant statique du wiki « Le Grenier > Fiches »
 * du forum. Un fichier par modèle.
 *
 * C'est la collection qui travaille pour le référencement à long terme :
 * les requêtes « Siare CL240 caractéristiques » n'ont aujourd'hui aucune
 * réponse correcte. Elle vaut donc la rigueur qu'on y met — d'où
 * `sourceReleves`, qui force à dire d'où viennent les chiffres.
 */
const fiches = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fiches' }),
  schema: z.object({
    // La plaque est obligatoire ici : une fiche matériel sans plaque
    // signalétique n'est pas une fiche, c'est une note.
    plaque,

    resume: z.string(),
    type: z.enum([
      'Enceinte',
      'Amplificateur',
      'Préamplificateur',
      'Platine',
      'Tuner',
      'Lecteur CD',
      'Haut-parleur',
    ]),
    date: z.coerce.date(),
    misAJour: z.coerce.date().optional(),
    brouillon: z.boolean().default(false),

    // D'où viennent les valeurs de la plaque. « Relevé sur l'étiquette au
    // dos de l'exemplaire n° … » n'a pas la même valeur qu'une notice
    // scannée ou qu'un forum étranger, et le lecteur a le droit de savoir
    // laquelle des trois il lit.
    sourceReleves: z.string(),

    sujetForum: z.url().optional(),
  }),
});

export const collections = { guides, fiches };
