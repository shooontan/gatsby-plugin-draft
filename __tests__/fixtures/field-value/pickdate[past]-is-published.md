---
title: "Date path"
publishedAt: "2000-01-01"

# for test
pluginOptions:
  pickDate: 'node.frontmatter.publishedAt' # convert `node => node.frontmatter.publishedAt`
mockdate:
  - "2020-01-01"
expected:
  draft: false
---

This post is published.
