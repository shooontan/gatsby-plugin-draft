const moment = require('moment-timezone');

const defaultOptions = {
  fieldName: 'draft',
  timezone: 'UTC',
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

  const nodeDate = moment.tz(node.frontmatter.date, options.timezone);
  const nowDate = moment().tz(options.timezone);
  const isDraft = nowDate.isSameOrBefore(nodeDate);

  createNodeField({
    node,
    name: options.fieldName,
    value: isDraft && process.env.NODE_ENV === 'production',
  });
};
