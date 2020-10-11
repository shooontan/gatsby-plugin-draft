# gatsby-plugin-draft

[![npm version](https://img.shields.io/npm/v/gatsby-plugin-draft.svg)](https://www.npmjs.com/package/gatsby-plugin-draft)
[![install size](https://packagephobia.now.sh/badge?p=gatsby-plugin-draft)](https://packagephobia.now.sh/result?p=gatsby-plugin-draft)
[![Build Status](https://travis-ci.com/shooontan/gatsby-plugin-draft.svg?branch=master)](https://travis-ci.com/shooontan/gatsby-plugin-draft)


GatsbyJS Plugin for adding draft field to node.

This plugin adds draft field to decide whether publish to Gatsby's data system node. For example, when we build blog (with `gatsby-transformer-remark`), GatsbyJS creates `MarkdownRemark` nodes. This node has `frontmatter` property. If `frontmatter` includes `date` metadata, `gatsby-plugin-draft` add automatically `draft` value to Gatsby's node field.

## Install

```bash
# npm
$ npm install gatsby-plugin-draft

# or yarn
$ yarn add gatsby-plugin-draft
```

## How to use

### gatsby-config.js

#### with Markdown

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

#### with MDX

You need to add `gatsby-source-filesystem` and `gatsby-plugin-mdx`. Set `Mdx` to `nodeType` option.

```js
module.exports = {
  plugins: [
    'gatsby-source-filesystem',
    'gatsby-plugin-mdx',
    {
      resolve: 'gatsby-plugin-draft',
      options: {
        nodeType: 'Mdx',
      },
    },
  ],
};
```

#### other source

You need to add `gatsby-source-anydata`. Set node internal type to `nodeType` option.

```js
module.exports = {
  plugins: [
    'gatsby-source-anydata',
    {
      resolve: 'gatsby-plugin-draft',
      options: {
        nodeType: 'Anydata',
      },
    },
  ],
};
```

### gatsby-node.js

You can query like the following. The important thing is to add `filter`. That query results is only the post whose `draft` is `false`.

```js
const markdownTemplate = 'app/template/markdown';
const mdxTemplate = 'app/template/mdx';
const anycmsTemplate = 'app/template/anycms';

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          filter: { fields: { draft: { eq: false } } } # add
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
        allMdx(
          filter: { fields: { draft: { eq: false } } } # add
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
        allAnycms(
          filter: { fields: { draft: { eq: false } } } # add
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `
  );

  if (result.errors) {
    reporter.panic(result.errors);
  }

  result.data.allMarkdownRemark.edges.forEach(post => {
    createPage({
      path: post.node.fields.slug,
      component: markdownTemplate,
      context: {
        slug: post.node.fields.slug,
      },
    });
  });

  result.data.allMdx.edges.forEach(post => {
    createPage({
      path: post.node.fields.slug,
      component: mdxTemplate,
      context: {
        slug: post.node.fields.slug,
      },
    });
  });

  result.data.anyCms.edges.forEach(post => {
    createPage({
      path: post.node.fields.slug,
      component: anycmsTemplate,
      context: {
        slug: post.node.fields.slug,
      },
    });
  });
};
```

### pages/index.js

Add filter in each pages.

```js
export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(
      filter: { fields: { draft: { eq: false } } } # here
    ) {
      edges {
        node {
          excerpt
        }
      }
    }
    allMdx(
      filter: { fields: { draft: { eq: false } } } # here
    ) {
      edges {
        node {
          excerpt
        }
      }
    }
    allAnycms(
      filter: { fields: { draft: { eq: false } } } # here
    ) {
      edges {
        node {
          excerpt
        }
      }
    }
  }
`;
```

### Draft Pattern

Let's say you have the following content. If you run `gatsby build` on Feb 22. 2019, the First Post will be published, but Second-Post will not be published.

If you build on Feb 26. 2019, both post will be published.

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

Another Example. If a post has `draft: true` in frontmatter, the post is never published even if `date` is before build date time.

```md
---
id: 3
title: Second Post
date: 2010-10-10
draft: true
---

Draft content, forever and ever!
```

### Options

```js
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-draft',
      options: {
        /**
         * Be added field name. [Optional]
         *
         * Type: string
         * Default: 'draft'
         **/
        fieldName: 'notReleased',

        /**
         * moment-timezone. [Optional]
         *
         * Type: string
         * Default: 'UTC'
         **/
        timezone: 'Asia/Tokyo',

        /**
         * Gatsby's node internal type. [Optional]
         *
         * Type: string
         * Default: 'MarkdownRemark'
         **/
        nodeType: 'GatsbyNodeInternalType',

        /**
         * Date information. [Optional]
         *
         * Type: function
         *   - node: Gatsby's data node. https://www.gatsbyjs.com/docs/node-interface/
         * Default: node => node.frontmatter.date
         **/
        pickDate: node => node.metadata.publishedAt,

        /**
         * Draft information. [Optional]
         *
         * Type: function
         *   - node: Gatsby's data node. https://www.gatsbyjs.com/docs/node-interface/
         * Default: node => node.frontmatter.draft
         **/
        pickDraft: node => node.metadata.isDraft,

        /**
         * publish draft posts [Optional]
         * Default is 'false'
         **/
        publishDraft: process.env.NODE_ENV !== 'production',
      },
    },
  ],
};
```

#### publishDraft

If `publishDraft` is `false`, the posts which have draft field valued `true` does not published. So we can not edit watching that posts. This option is useful when we edit posts in development mode (`gatsby develop`).
