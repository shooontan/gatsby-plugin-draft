const fs = require('fs');
const path = require('path');
const mockdate = require('mockdate');
const moment = require('moment-timezone');
const matter = require('gray-matter');
const glob = require('glob');

const { onCreateNode } = require('../gatsby-node');
const { get } = require('../utils');

function loadContent(mockPath) {
  const content = fs.readFileSync(mockPath, 'utf8');
  return matter(content);
}

function getMocks(pattern) {
  return glob.sync(path.resolve(__dirname, 'fixtures', pattern, '**'), {
    nodir: true,
  });
}

const internalTypeMock = getMocks('internal-type');
const fieldValueMock = getMocks('field-value');

describe.each(internalTypeMock)('internal type: %s', mock => {
  const content = loadContent(mock);
  const { pluginOptions, nodeType, expected } = content.data;

  const type = get(() => nodeType, 'MarkdownRemark');
  const node = {
    internal: {
      type,
    },
    frontmatter: content.data,
  };
  const createNodeField = jest.fn();
  onCreateNode(
    {
      node,
      actions: { createNodeField },
    },
    pluginOptions
  );

  test(`call times shold be ${expected.calledTimes}`, () => {
    expect(createNodeField).toHaveBeenCalledTimes(expected.calledTimes);
  });

  mockdate.reset();
});

describe.each(fieldValueMock)('draft field value: %s', mock => {
  moment.tz.setDefault('UTC');

  const content = loadContent(mock);
  const { pluginOptions, mockdate: fixtureMockData, expected } = content.data;

  // set mock if exist
  if (fixtureMockData) {
    const time = fixtureMockData[0];
    const tz = fixtureMockData[1] || 'UTC';
    mockdate.set(moment.tz(time, tz));
  }

  // datePath option
  if (pluginOptions && pluginOptions.datePath) {
    const datePathStr = pluginOptions.datePath;
    pluginOptions.datePath = node => {
      let result = {
        node,
      };
      datePathStr.split('.').forEach(seg => {
        result = result[seg];
      });
      return result;
    };
  }

  // draftPath option
  if (pluginOptions && pluginOptions.draftPath) {
    const draftPathStr = pluginOptions.draftPath;
    pluginOptions.draftPath = node => {
      let result = {
        node,
      };
      draftPathStr.split('.').forEach(seg => {
        result = result[seg];
      });
      return result;
    };
  }

  const node = {
    internal: {
      type: get(() => pluginOptions.nodeType, 'MarkdownRemark'),
    },
    frontmatter: content.data,
  };
  const createNodeField = jest.fn();
  onCreateNode(
    {
      node,
      actions: { createNodeField },
    },
    pluginOptions
  );

  test(`field.draft should be ${expected.draft}`, () => {
    const fieldCall = createNodeField.mock.calls[0][0];
    expect(fieldCall.value).toEqual(expected.draft);
  });

  mockdate.reset();
});
