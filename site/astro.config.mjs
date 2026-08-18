// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` est la source unique de vérité pour les canonical, le sitemap
// et le RSS. Une seule valeur à changer le jour où le domaine bouge.
export default defineConfig({
  site: 'https://atelierhifi.fr',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Le forum vit sur son propre sous-domaine et gère son propre
      // sitemap. On ne le référence pas ici, sinon doublon.
      filter: (page) => !page.includes('/mentions-legales'),
    }),
  ],
  build: {
    format: 'directory',
  },
});
