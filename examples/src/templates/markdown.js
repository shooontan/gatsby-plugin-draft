import React from 'react';
import { graphql } from 'gatsby';

const MarkdownPost = props => {
  const { markdownRemark } = props.data;
  const html = props.data.markdownRemark.html;
  return (
    <div>
      <p>
        {markdownRemark.frontmatter.title}({markdownRemark.frontmatter.date})
      </p>
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  );
};

export default MarkdownPost;

export const pageQuery = graphql`
  query MarkdownPost($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      id
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
