# gatsby-plugin-draft

[![npm version](https://img.shields.io/npm/v/gatsby-plugin-draft.svg)](https://www.npmjs.com/package/gatsby-plugin-draft)
[![install size](https://packagephobia.now.sh/badge?p=gatsby-plugin-draft)](https://packagephobia.now.sh/result?p=gatsby-plugin-draft)
[![Build Status](https://travis-ci.com/shooontan/gatsby-plugin-draft.svg?branch=master)](https://travis-ci.org/shooontan/gatsby-plugin-draft)


GatsbyJS Plugin for adding draft field to node.

This plugin adds draft fields to decide whether publish to Gatsby's data system node. The `MarkdownRemark` type node which generated by `gatsby-transformer-remark` has frontmatter property. If frontmatter has `date` and the date is later then build date time, this plugin adds `draft` valued `true` to node field. If not, `draft` field is `false`.

If you want to keep a post in drafts no matter what the date is, add `draft: true` to the frontmatter directly.

## Install

```bash
# npm
$ npm install gatsby-plugin-draft

# or yarn
$ yarn add gatsby-plugin-draft
```

## How to use

### gatsby-config.js

You need to add `gatsby-source-filesystem` and `gatsby-transformer-remark`.

```js
module.exports = {
  plugins: [
    'gatsby-source-filesystem',
    'gatsby-transformer-remark',
    'gatsby-plugin-draft'
  ],
};
```

### gatsby-node.js

You can query like the following. The important thing is to add `filter`. That query results is only the post whose `draft` is `false`.

```js
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  const templatePath = 'app/template/path';

  return graphql(
    `
      {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark(
          filter: { fields: { draft: { eq: false } } } # add
        ) {
          edges {
            node {
              excerpt
              frontmatter {
                date
                title
              }
            }
          }
        }
      }
    `
  ).then(result => {
    result.data.allMarkdownRemark.edges.forEach(post => {
      // create page
      createPage({
        path: post.node.fields.slug,
        component: templatePath,
      });
    })
  });
};
```

Let's say you have the following content. If you run `gatsby build` on Feb 22. 2019, the First-Post will be built and published, but Second-post will not be built or published.

If you build on Feb 26. 2019, both post will be built and published.

```md
---
id: 1
title: First Post
date: 2019-02-20
---

Published content.
```

```md
---
id: 2
title: Second Post
date: 2019-02-25
---

Draft content.
```

> :memo: Note :memo:
>
>In develop (`gatsby develop`), `draft` will always be `false`, so posts will display.
>
>`draft` will be `true` only when in production (`gatsby build`).
>

If the option respectExplicitDraft was set to true with `respectExplicitDraft: true`, AND the second post from above was modified to include the line `draft: true` in the frontmatter, then it will still not be published even if gatsby build was run after the 25th.

```md
---
id: 2
title: Second Post
date: 2019-02-25
draft: true
---

Draft content.
```

### Options

```js
module.exports = {
  plugins: [
    'gatsby-source-filesystem',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-plugin-draft',
      options: {
        /**
         * be added field name
         * Default is 'draft'
         **/
        fieldName: 'released',
        /**
         * moment-timezone
         * Default is 'UTC'
         **/
        timezone: 'Asia/Tokyo',
        /**
         * allows adding
         *  draft: true
         * to the frontmatter of a post to
         * keep it in drafts indefinitely
         * Default is 'false',
         **/
        respectExplicitDraft: true,
      },
    },
  ],
};
```
