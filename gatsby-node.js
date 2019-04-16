const moment = require('moment-timezone');

const defaultOptions = {
  fieldName: 'draft',
  timezone: 'UTC',
  publishDraft: false,
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

  if (!node.frontmatter || options.publishDraft === true) {
    createNodeField({
      node,
      name: options.fieldName,
      value: false,
    });
    return;
  }

  const { date, draft } = node.frontmatter;

  if (draft === true) {
    createNodeField({
      node,
      name: options.fieldName,
      value: true,
    });
    return;
  }

  if (!date) {
    createNodeField({
      node,
      name: options.fieldName,
      value: false,
    });
    return;
  }

  const nodeDate = moment.tz(date, options.timezone);
  const nowDate = moment().tz(options.timezone);
  const isDraft = nowDate.isSameOrBefore(nodeDate);

  createNodeField({
    node,
    name: options.fieldName,
    value: isDraft,
  });
};
