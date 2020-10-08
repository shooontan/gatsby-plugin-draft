---
title: "Draft path"
isDraft: false

# for test
pluginOptions:
  draftPath: 'node.frontmatter.isDraft' # convert `node => node.frontmatter.isDraft`
mockdate:
  - "2020-01-01"
expected:
  draft: false
---

This post is published.
