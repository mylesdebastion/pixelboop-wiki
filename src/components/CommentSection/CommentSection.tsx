import React from 'react';
// import Giscus from "@giscus/react";
// import { useColorMode } from '@docusaurus/theme-common';
// import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// COMMENTS DISABLED (leak-stop, 2026-06-19).
//
// This wiki was forked from 203-Systems/Matrix-Wiki. The Giscus config below
// still pointed at the UPSTREAM repo (203-Systems/Matrix-Wiki), so every comment
// posted on wiki.pixelboop.com was landing in a third party's GitHub Discussions.
// The mount is disabled to stop that leak immediately.
//
// TO RE-ENABLE on the Pixelboop wiki's OWN repo (mylesdebastion/pixelboop-wiki):
//   1. On GitHub, enable Discussions for mylesdebastion/pixelboop-wiki
//      (Settings, General, Features, Discussions) and create a "Comments" category.
//   2. Install the Giscus GitHub app on that repo: https://github.com/apps/giscus
//   3. Go to https://giscus.app, enter mylesdebastion/pixelboop-wiki, pick the
//      "Comments" category, and copy the generated data-repo-id and
//      data-category-id.
//   4. Restore the component below, replacing repo / repoId / categoryId with the
//      Pixelboop values. Also repoint the theme CSS away from matrix.203.io
//      (this repo already self-hosts via /giscus-dark.css and /giscus-light.css,
//      see vercel.json and api/giscus-*.js).
//
// Previous (UPSTREAM, do NOT reuse) values, kept only as a reference for the swap:
//   repo="203-Systems/Matrix-Wiki"
//   repoId="R_kgDOMv99gw"
//   category="Comments"
//   categoryId="DIC_kwDOMv99g84Ci8V7"

export default function GiscusComponent(): JSX.Element | null {
  // Render nothing until comments are repointed at the Pixelboop wiki repo.
  return null;

  /* Re-enable with Pixelboop repo + IDs (see notes above):
  const { colorMode } = useColorMode();
  const { i18n } = useDocusaurusContext();

  return (
    <Giscus
      repo="mylesdebastion/pixelboop-wiki"
      repoId="REPLACE_WITH_PIXELBOOP_REPO_ID"
      category="Comments"
      categoryId="REPLACE_WITH_PIXELBOOP_CATEGORY_ID"
      mapping="pathname"
      strict="1"
      reactionsEnabled="0"
      emitMetadata="0"
      inputPosition="top"
      theme={colorMode == 'dark' ? '/giscus-dark.css' : '/giscus-light.css'}
      lang={i18n.currentLocale === 'zh-Hans' ? 'zh-CN' : 'en'}
      loading="lazy"
      crossorigin="anonymous"
      async
    />
  );
  */
}
