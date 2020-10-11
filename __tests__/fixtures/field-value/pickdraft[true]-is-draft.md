---
title: "Draft path"
isDraft: true

# for test
pluginOptions:
  pickDraft: 'node.frontmatter.isDraft' # convert `node => node.frontmatter.isDraft`
mockdate:
  - "2020-01-01"
expected:
  draft: true
---

This post is draft.
