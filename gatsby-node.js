const defaultOptions = {
  fieldName: 'draft',
};

exports.onCreateNode = ({ node, actions }, pluginOptions) => {
  const { createNodeField } = actions;

  const options = {
    ...defaultOptions,
    ...pluginOptions,
  };

  if (node.internal.type !== 'MarkdownRemark') {
    return;
  }

  if (!node.frontmatter || !node.frontmatter.date) {
    createNodeField({
      node,
      name: options.fieldName,
      value: false,
    });
    return;
  }

  const nodeDate = new Date(node.frontmatter.date);
  const nowDate = new Date();
  const isDraft = nowDate.getTime() <= nodeDate.getTime();

  createNodeField({
    node,
    name: options.fieldName,
    value: isDraft && process.env.NODE_ENV === 'production',
  });
};
