import React from 'react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';

const MdxPost = props => {
  const mdx = props.data.mdx;

  return (
    <div>
      <p>
        {mdx.frontmatter.title}({mdx.frontmatter.date})
      </p>
      <MDXRenderer>{mdx.body}</MDXRenderer>
    </div>
  );
};

export default MdxPost;

export const pageQuery = graphql`
  query MdxPost($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      body
      fields {
        slug
      }
      frontmatter {
        title
        date(formatString: "YYYY.MM.DD")
      }
    }
  }
`;
