module.exports = {
  siteMetadata: {
    title: 'Blog',
    description: 'My blog.',
    siteUrl: 'https://example.com/',
  },
  plugins: [
    /**
     * Markdown
     */
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/markdown`,
      },
    },
    'gatsby-transformer-remark',
    'gatsby-plugin-draft',

    /**
     * Mdx
     */
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/mdx`,
      },
    },
    'gatsby-plugin-mdx',
    {
      resolve: 'gatsby-plugin-draft',
      options: {
        nodeType: 'Mdx',
        fieldName: 'isDraft',
      },
    },

    /**
     * REST API
     */
    {
      resolve: 'gatsby-source-custom-api',
      options: {
        url: 'http://localhost:8008/restapi/items.json',
        rootKey: 'Sweet',
      },
    },
    {
      resolve: 'gatsby-plugin-draft',
      options: {
        nodeType: 'Sweet',
        pickDate: node => node.publishedAt,
        pickDraft: node => node.draft,
      },
    },
  ],
};
