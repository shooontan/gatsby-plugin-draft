const moment = require('moment-timezone');
const { get } = require('./utils');

const defaultOptions = {
  fieldName: 'draft',
  timezone: 'UTC',
  nodeType: 'MarkdownRemark',
  pickDate: node => node.frontmatter.date,
  pickDraft: node => node.frontmatter.draft,
  publishDraft: false,
};

/**
 * @param {object}
 * @param {defaultOptions} pluginOptions
 */
exports.onCreateNode = ({ node, actions, reporter }, pluginOptions) => {
  const { createNodeField } = actions;

  const options = {
    ...defaultOptions,
    ...pluginOptions,
  };

  if (node.internal.type !== options.nodeType) {
    return;
  }

  // all node is not draft if publishDraft option is `true`
  if (options.publishDraft === true) {
    createNodeField({
      node,
      name: options.fieldName,
      value: false,
    });
    return;
  }

  const date = get(() => options.pickDate(node));
  const draft = get(() => options.pickDraft(node));

  // node follows 'draft' value
  if (draft === true) {
    createNodeField({
      node,
      name: options.fieldName,
      value: true,
    });
    return;
  }

  // node is draft if 'draft' value does not exist
  if (!date) {
    createNodeField({
      node,
      name: options.fieldName,
      value: false,
    });
    return;
  }

  // set draft flag after comparing date value
  const nodeDate = moment.tz(date, options.timezone);
  const nowDate = moment().tz(options.timezone);
  const isDraft = nowDate.isSameOrBefore(nodeDate);

  createNodeField({
    node,
    name: options.fieldName,
    value: isDraft,
  });
};
