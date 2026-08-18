import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const guides = (await getCollection('guides'))
    .filter((g) => !g.data.brouillon)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Atelier HiFi',
    description:
      "Restauration d'enceintes et d'électroniques hi-fi françaises des années 60 à 80.",
    site: context.site,
    customData: '<language>fr-FR</language>',
    items: guides.map((g) => ({
      title: g.data.titre,
      description: g.data.resume,
      pubDate: g.data.date,
      link: `/guides/${g.id}/`,
    })),
  });
}
