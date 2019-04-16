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

test('MarkdownRemark without frontmatter', () => {
  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
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

test('MarkdownRemark without date or dtaft', () => {
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

test('draft should be true if frontmatter draft is true', () => {
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
  expect(createNodeField.mock.calls[0][0].value).toBeTruthy();
  expect(createNodeField).toHaveBeenCalledTimes(1);
});

test('draft should be false if frontmatter draft is false', () => {
  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'post title',
      draft: false,
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

test('draft should be true if frontmatter date time is same or after build time', () => {
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
  expect(createNodeField.mock.calls[0][0].value).toBeTruthy();
  expect(createNodeField).toHaveBeenCalledTimes(1);

  mockdate.reset();
});

test('draft should be false in specific timezone', () => {
  mockdate.set(moment.tz('2019-02-05', 'UTC'));

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

  mockdate.reset();
});

test('draft should be true in specific timezone', () => {
  mockdate.set(moment.tz('2019-02-05', 'UTC'));

  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'post title',
      date: '2019-02-05T12:00',
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

  mockdate.reset();
});

test('draft should be true if frontmatter draft is true, even if frontmatter date is past', () => {
  mockdate.set(moment.tz('2019-02-23', 'UTC'));

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

  onCreateNode({
    node,
    actions,
  });

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeTruthy();
  expect(createNodeField).toHaveBeenCalledTimes(1);

  mockdate.reset();
});

test('draft should be false if frontmatter draft is false and date is past time', () => {
  mockdate.set(moment.tz('2019-02-23', 'UTC'));

  const createNodeField = jest.fn();
  const actions = { createNodeField };

  const node = {
    internal: {
      type: 'MarkdownRemark',
    },
    frontmatter: {
      title: 'post title',
      date: '2019-02-07',
      draft: false,
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

test('draft should false if publishDraft option is true', () => {
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

  onCreateNode(
    {
      node,
      actions,
    },
    {
      publishDraft: true,
    }
  );

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeFalsy();
  expect(createNodeField).toHaveBeenCalledTimes(1);
});

test('draft should true if publishDraft option is false', () => {
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

  onCreateNode(
    {
      node,
      actions,
    },
    {
      publishDraft: false,
    }
  );

  expect(createNodeField).toMatchSnapshot();
  expect(createNodeField.mock.calls[0][0].name).toBe('draft');
  expect(createNodeField.mock.calls[0][0].value).toBeTruthy();
  expect(createNodeField).toHaveBeenCalledTimes(1);
});
