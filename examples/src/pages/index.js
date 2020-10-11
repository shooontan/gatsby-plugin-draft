import React from 'react';
import { graphql, Link } from 'gatsby';

const IndexPage = props => {
  const mdPosts = props.data.allMarkdownRemark.nodes.map(node => {
    return (
      <div key={node.fields.slug}>
        <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
        <span>{node.frontmatter.date}</span>
      </div>
    );
  });

  const mdxPosts = props.data.allMdx.nodes.map(node => {
    return (
      <div key={node.fields.slug}>
        <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
        <span>{node.frontmatter.date}</span>
      </div>
    );
  });

  const sweetPosts = props.data.allSweet.nodes.map(node => {
    return (
      <div key={node.fields.slug}>
        <Link to={node.fields.slug}>{node.title}</Link>
        <span>{node.publishedAt}</span>
      </div>
    );
  });

  return (
    <div>
      {mdPosts}
      {mdxPosts}
      {sweetPosts}
      <Link to="/404">404 page</Link>
    </div>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageQuery {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
    allMarkdownRemark(filter: { fields: { draft: { eq: false } } }) {
      nodes {
        fields {
          draft
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY.MM.DD")
        }
      }
    }
    allMdx(filter: { fields: { isDraft: { eq: false } } }) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          date(formatString: "YYYY.MM.DD")
        }
      }
    }
    allSweet(filter: { fields: { draft: { eq: false } } }) {
      nodes {
        body
        title
        publishedAt
        fields {
          slug
        }
      }
    }
  }
`;
