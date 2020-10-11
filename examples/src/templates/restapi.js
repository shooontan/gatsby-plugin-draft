import React from 'react';
import { graphql } from 'gatsby';

const RestAPIPost = props => {
  const { sweet } = props.data;
  return (
    <div>
      <p>
        {sweet.title}({sweet.publishedAt})
      </p>
      <div
        dangerouslySetInnerHTML={{
          __html: sweet.body,
        }}
      />
    </div>
  );
};

export default RestAPIPost;

export const pageQuery = graphql`
  query RestAPIPost($slug: String!) {
    sweet(fields: { slug: { eq: $slug } }) {
      title
      publishedAt(formatString: "YYYY.MM.DD")
      body
      fields {
        slug
      }
    }
  }
`;
