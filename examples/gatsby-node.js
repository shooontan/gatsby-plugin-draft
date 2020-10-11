const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

const markdownTemplate = path.resolve(__dirname, 'src/templates/markdown.js');
const mdxTemplate = path.resolve(__dirname, 'src/templates/mdx.js');
const restapiTemplate = path.resolve(__dirname, 'src/templates/restapi.js');

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const result = await graphql(
    `
      {
        site {
          siteMetadata {
            title
          }
        }
        allMarkdownRemark(filter: { fields: { draft: { eq: false } } }) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
        allMdx(filter: { fields: { isDraft: { eq: false } } }) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
        allSweet(filter: { fields: { draft: { eq: false } } }) {
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

  result.data.allSweet.edges.forEach(post => {
    createPage({
      path: post.node.fields.slug,
      component: restapiTemplate,
      context: {
        slug: post.node.fields.slug,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value,
    });
  }

  if (node.internal.type === 'Mdx') {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: 'slug',
      node,
      value,
    });
  }

  if (node.internal.type === 'Sweet') {
    createNodeField({
      name: 'slug',
      node,
      value: `/${node.id__normalized}`,
    });
  }
};
