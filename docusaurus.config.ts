import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'PixelBoop Wiki',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://wiki.pixelboop.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'mylesdebastion', // Updated to user's org
  projectName: 'pixelboop-wiki', // Updated to project name

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Simplified to only English for now
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          lastVersion: 'current',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          routeBasePath: '/', // Make docs the site root
        },
        blog: false, // Disabled blog
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    docs: {
      versionPersistence: 'localStorage',
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: '',
      logo: {
        alt: 'PixelBoop Wiki',
        src: 'img/pixelboop-logo.svg',
        srcDark: 'img/pixelboop-logo-dark.svg',
        width: 140,
        height: 20,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'mainSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/mylesdebastion/pixelboop',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/GettingStarted/GettingStarted',
            },
            {
              label: 'Making Sound',
              to: 'docs/MakingSound/Gestures',
            },
            {
              label: 'Jam with Others',
              to: 'docs/JamWithOthers/MultiDeviceSync',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'PixelBoop Web',
              href: 'https://pixelboop.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Pixelboop Wiki Content - Audiolux Devices and dbinc. <br/> Documentation framework based on <a href="https://github.com/203-Systems/Matrix-Wiki" target="_blank">203 Systems' Docusaurus template</a>.`,
    },
    image: 'img/social-card.jpg',
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
// Sun Jan 25 02:01:56 PST 2026
