---
title: Pens of freedom
description: A dead easy 11ty plugin for publishing automatically code snippets to Codepen
tags: blog, eleventy
date: 2020-06-17T23:46:54+00:00
introImage: /static/img/digital-content-writers-india-y3Tl-cbU-CU-unsplash.jpg
introImageAlt: Image of a pen over a notepad
fulltextImage: /static/img/digital-content-writers-india-y3Tl-cbU-CU-unsplash.jpg
fulltextImageAlt: Image of a pen over a notepad
custom_excerpt: Creating live examples from code snippets in a site, particularly a documentation site, is extremely helpful for users, as they get to play with the code. Eleventy (rightfully) didn't have such functionality out of the box but don't despair...
layout: blog.njk
---

I will cut the long story short and go directly to the point: there is an [npm package](https://www.npmjs.com/package/11ty-to-codepen) that simplifies greatly the task of converting snippets to live pens on codepen. Here is the howto:

Before we go on, I need to point out that there is one **hard requirement** and that is to allow html in the markdown files.
Eleventy defaults to `html: false` which is also the default for the markdown-it Library.

- Make sure you have enabled it in your configuration!
- Eg:

```js
/* Markdown Overrides */
let markdownLibrary = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
});
eleventyConfig.setLibrary("md", markdownLibrary);
```

### Installation

Installation should follow the usual NPM dance:

```bash
npm i -D 11ty-to-codepen
```

### Usage

First, configure your .eleventy.js:

- Import it and define the shortcode:

```js
// At the top of the file add:
const codepenIt = require("11ty-to-codepen");

// Somewhere before the final return add:
eleventyConfig.addPairedShortcode("codepen", codepenIt);
```

- Use it in any `.md` file. Check the [README file](https://github.com/dgrammatiko/11ty-to-codepen) for the full explanation of the possible attributes.

## Here's a Live example:

{% codepen "https://unpkg.com/bonsai.css@latest/dist/bonsai.min.css", "https://unpkg.com/uhtml", "Heyyy", "Waz uuuuuuuup", "Test it" %}

#### Some very important HTML code:

```html
<h1 class="someClass" style="--grad:0deg; --grad-color:#3188c1;">Test</h1>
```

#### Some very important CSS code:

```css
body {
  margin: 4rem;
}
```

#### Some very important JavaScript code:

```js
import { render, html, svg } from "https://unpkg.com/uhtml?module";

const h1 = document.querySelector("h1");

h1.style.setProperty("--grad-color", "rebeccapurple");

render(document.body, html`${h1}`);
```

#### Click the following button to open the above 3 snippets on Codepen:

{% endcodepen %}
