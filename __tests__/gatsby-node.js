const mockdate = require('mockdate');
const moment = require('moment-timezone');
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
  mockdate.set(moment.tz('2019-02-05', 'UTC'));

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
  mockdate.set(moment.tz('2019-02-09', 'UTC'));

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
  mockdate.set(moment.tz('2019-02-05', 'UTC'));
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

test('draft should be false (timezone)', () => {
  mockdate.set(moment.tz('2019-02-05', 'UTC'));
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
      date: '2019-02-05',
    },
  };

  onCreateNode(
    {
      node,
      actions,
    },
    {
      timezone: 'Asia/Tokyo',
    }
  );

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeFalsy();
  expect(createNodeField).toHaveBeenCalledTimes(1);

  process.env.NODE_ENV = env;
  mockdate.reset();
});

test('draft should be true (timezone)', () => {
  mockdate.set(moment.tz('2019-02-05', 'UTC'));
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
      date: '2019-02-05 12:00',
    },
  };

  onCreateNode(
    {
      node,
      actions,
    },
    {
      timezone: 'Asia/Tokyo',
    }
  );

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeTruthy();
  expect(createNodeField).toHaveBeenCalledTimes(1);

  process.env.NODE_ENV = env;
  mockdate.reset();
});

test('draft set to true should be respected if enabled', () => {
  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'post title',
      draft: true,
    },
  };

  const pluginOptions = { respectExplicitDraft: true };

  onCreateNode(
    {
      node,
      actions,
    },
    pluginOptions
  );

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeTruthy();
  expect(createNodeField).toHaveBeenCalledTimes(1);
});

test('draft set to true should be ignored for default options', () => {
  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'post title',
      draft: true,
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

test('draft should be true, if explicitly set, even if the date is past', () => {
  mockdate.set(moment.tz('2019-02-23', 'UTC'));
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
      draft: true,
    },
  };

  const pluginOptions = { respectExplicitDraft: true };

  onCreateNode(
    {
      node,
      actions,
    },
    pluginOptions
  );

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeTruthy();
  expect(createNodeField).toHaveBeenCalledTimes(1);

  mockdate.reset();
});
