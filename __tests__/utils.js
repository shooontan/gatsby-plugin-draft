const { get } = require('../utils');

describe('utils', () => {
  test('get', () => {
    const node = {
      frontmatter: {
        date: '2020',
        draft: true,
      },
    };
    expect(get(() => node.frontmatter.date)).toEqual('2020');
    expect(get(() => node.dummy.draft)).toEqual(undefined);
  });
});
