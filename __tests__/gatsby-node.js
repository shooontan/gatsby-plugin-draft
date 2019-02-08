const mockdate = require('mockdate');
const { onCreateNode } = require('../gatsby-node');

test('not MarkdownRemark type node', () => {
  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'NotMarkdownRemark',
    },
  };

  onCreateNode({
    node,
    actions,
  });

  expect(createNodeField).toHaveBeenCalledTimes(0);
});

test('MarkdownRemark without date', () => {
  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'post title',
    },
  };

  onCreateNode({
    node,
    actions,
  });

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeFalsy();
  expect(createNodeField).toHaveBeenCalledTimes(1);
});

test('draft should be false, (Same or Before)', () => {
  mockdate.set(new Date('2019-02-05'));

  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'post title',
      date: '2019-02-07',
    },
  };

  onCreateNode({
    node,
    actions,
  });

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeFalsy();
  expect(createNodeField).toHaveBeenCalledTimes(1);

  mockdate.reset();
});

test('draft should be false, (not production)', () => {
  mockdate.set(new Date('2019-02-09'));

  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'post title',
      date: '2019-02-07',
    },
  };

  onCreateNode({
    node,
    actions,
  });

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeFalsy();
  expect(createNodeField).toHaveBeenCalledTimes(1);

  mockdate.reset();
});

test('draft should be true', () => {
  mockdate.set(new Date('2019-02-05'));
  const env = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'post title',
      date: '2019-02-07',
    },
  };

  onCreateNode({
    node,
    actions,
  });

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeTruthy();
  expect(createNodeField).toHaveBeenCalledTimes(1);

  process.env.NODE_ENV = env;
  mockdate.reset();
});
