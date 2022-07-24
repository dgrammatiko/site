---
title: From HTML to PWA Pt. 1
description: Site or App? SPA or MPA? React, Vue, Svelte, Solid or another framework/library? Use the platform or use a trendy framework? Let's start with plain HTML and figure out if we can reach the other end of the spectrum in a progressively enhancing way...
tags: blog, serverless, eleventy, HTML, CSS, JavaScript
date: 2022-07-03T15:46:54+00:00
image: dmitriy-demidov-WDO4CdpQtqs-unsplash-2.jpg
imageAltText: Image of a cassete by Dmitriy Demidov
custom_excerpt: Site or App? SPA or MPA? React, Vue, Svelte, Solid, Lit, μhtml or another framework/library? Use the platform or use a trendy framework? Let's start with plain HTML and figure out if we can reach the other end of the spectrum in a progressively enhancing way...
---

For some time, there was (probably the hype is still alive) a quite toxic discussion about the difference between a site and an app. Twitter is full of threads about this topic or similar topics like MPA vs SPA, use the platform vs use React/Vue/Svelte/Solid/..., etc. All of these are pretty polarized, and quite honestly, there are cases where the arguments are at least legit. Although the WEB platform has become potent in many cases, it still lacks some APIs and features required for particular problems. E.g. for a site that needs fancy animations between navigation links, it is not possible to use some platform primitive because it cannot do CSS animations between MPA navigation. Thus an SPA seems the only way to do it (although page transitions are on the way). Or, if a site needs to keep a video/audio player in the background, it is impossible to use some platform primitive because it cannot do media playback in the background; thus, SPA is the only way.

So, I thought I would pour more gasoline into the fire by trying to build a simple "thing" that would start as a simple HTML page (e.g. MPA) and end up as an SPA PWA. But to do so, I needed some inspiration; thankfully, a simple surf around the web and many ideas emerged, but I chose to go with an implementation of a web radio player, e.g. select a web radio station and hear their music.

A short list of the tasks that the "thing" should comply with could be broken down to:
- it should gracefully degrade to a simple HTML page and remain usable if the browser does not load any CSS or JS
- use CSS and JS to enhance it and convert it to SPA
- add a Service Worker to lift it to PWA
- use only the platform APIs for the client side
- don't use any library/meta framework/etc

## HTML, the mother language

According to the [Can I Use](https://caniuse.com/audio), the audio element was introduced by all browsers back in 2009-2010, so it's fair to assume that by now should be highly stable and bugless. Also, since my hypothetical project only needs this element to play audio, I could use it directly in the HTML and call it a day. The code required is only a few lines; it is pretty simple, and below is an example:

<details>
  <summary>A simple HTML page with an audio element</summary>

```html
<!doctype html>
<html lang="en" style="color-scheme: dark light;">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Web Radio Player">
    <title>Web Radio Player</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📣</text></svg>">
  </head>
  <body>
    <audio controls src="http://best.live24.gr/best1222"></audio>
  </body>
</html>
```

</details>
<br>

A live preview is available [here](/blog/from-html-to-pwa/radio). You'll probably think this is not the most attractive page you've ever landed on, but that's somewhat expected. If there's no CSS, no styling is applied, bare metal (HTML). So, although the page is just a few lines of HTML, there is already some magic in it: the page will work *without* JavaScript, and that's progressive enhancement in practice. Well, I just found out that Safari doesn't apply any interactivity to the audio element if JS is disabled; tell me about the state of the Browsers and baseline compatibility. Anyways, all the above is probably nothing new, so let's investigate how we could spice up the code to something more interesting.

There are a few ways to add multiple radio stations; one is by rendering each station as a separate page and having a static generator produce these pages. A simple UL/LI structure could provide a way to navigate between stations. But that would be pretty basic, and since I want to enhance this page later on with Javascript, I decided to go with a different approach. So, instead of having a pool of radio stations, let's add some countries to the equation. That should spice things enough. Right, and how are we supposed to do that? I mean we could add a landing page for each country with links to all the radio stations of the country but as I said before, that's not the way I had mind. The idea right from the start was to use a Form element with a Select element to select a country another Select element to select a station and a Button. But that's not the way I had in mind.

<details>
  <summary>A simple HTML page with a form containing 2 select elements and a button</summary>

```html
<!doctype html>
<html lang="en" style="color-scheme: dark light;">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Web Radio Player">
    <title>Web Radio Player</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📣</text></svg>">
  </head>
  <body>
    <h1>Web Radio Player</h1>
    <form action="/" method="post">
      <fieldset aria-labelledby="station-label">
        <legend id="station-label">Station Selector</legend>
        <div>
          <label for="country">Country</label>
          <select name="country" id="country">
              <option value="GR" selected>Greece</option>
          </select>
        </div>
        <div>
          <label for="station">Station</label>
          <select name="station" id="station">
              <option value="BEST" selected>Best Radio</option>
          </select>
        </div>

        <button type="submit">Apply selection</button>
      </fieldset>
    </form>
  </body>
</html>
```

</details>
<br>

Checking the HTML code above, someone could see that to use the selected values from the Select elements and render the appropriate Audio element with the proper source, there should be some Javascript code. But that's not the only way to do it. The Form element is pure magic, and the action and method attribute probably reveal where I'm going with this. For those that still need some help, the [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) page is an excellent place to start. A form with a method of "post" and an action of "/" will send the form data to the same page; this means that if the backend could produce the form and also manipulate the form data, then we're golden: we could have interactivity without writing any lines of Javascript. Progressive enhancement is a good thing. But, wait, we exchanged some client-side Javascript code with a full-blown server-side code. Well, kind of, but not exactly. Ten years ago, the same approach would have required some shared or VPN server to host the backend and probably the backend language would have been PHP. The state of the WEB is rather exceptional in the third decade of the 2000s. There are quite a few options for publishing statically generated sites, and most of these options provide serverless functions and some even edge functions. The difference between serverless and edge functions is that the latter ones execute to the nearest data centre compared to the first ones running to some specific region. Therefore a simple hosting to either Netlify, Vercel or even Firebase would be advantageous for this project. Bonus, all of these platforms provide some generous free tiers (and in my case, I shouldn't have to pay anything unless I'm unlucky and the site gets extremely popular, I'd doubt it). These platforms have extensive documentation for their serverless functions, but I used a static generator that would connect the dots, so I had to write less code. The SSG of my choice was [11ty](https://11ty.dev) as I have already used it many times to deploy many sites, and I really like that it doesn't enforce anything. Let us dive into the implementation then...

- Create a folder for the project and navigate to it.
- Run `npm init` to create a package.json file.
- Run `npm install @11ty/eleventy @netlify/functions` to install 11ty and the required module for the serverless functionality.
- Create a file `.eleventy.js` in the root of the project with the following content:

<details>
  <summary>.eleventy.js</summary>

```js
const { EleventyServerlessBundlerPlugin } = require('@11ty/eleventy');

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksFilter('activeStation', function(array, station) {
    const x = array.filter(x => x.code === station);
    if (x.length) {
      return x[0];
    }
    return {}
  });

  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: 'serverless',
    functionsDir: './netlify/functions/',
    copy: [
      { from: "assets", to: "assets" },
    ]
  });

  eleventyConfig.addPassthroughCopy("assets");
};
```

</details>
<br>

- Create a `netlify/functions/serverless` folder in the root of the project.
- Create a `index.js` file in the `netlify/functions/serverless` folder with the following content:

<details>
  <summary>index.js</summary>

```js
const { EleventyServerless } = require('@11ty/eleventy');

// Explicit dependencies for the bundler from config file and global data.
// The file is generated by the Eleventy Serverless Bundler Plugin.
require('./eleventy-bundler-modules.js');

async function handler(event) {
  let elev = new EleventyServerless('serverless', {
    path: new URL(event.rawUrl).pathname,
    query: event.multiValueQueryStringParameters || event.queryStringParameters,
    functionsDir: './netlify/functions/',
  });

  try {
    if (event.httpMethod === 'POST') {
      const formData = (new URLSearchParams(event.body))

      if (formData.get('country') || formData.get('station')) {
        elev.options.query = {
          country: formData.get('country'),
          station: formData.get('station'),
        };
      }
    }

    let [page] = await elev.getOutput();

    // If you want some of the data cascade available in `page.data`,
    // use `eleventyConfig.dataFilterSelectors`.
    // Read more: https://www.11ty.dev/docs/config/#data-filter-selectors

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
      },
      body: page.content,
    };
  } catch (error) {
    // Only console log for matching serverless paths
    if (elev.isServerlessUrl(event.path)) {
      console.log('Serverless Error:', error);
    }

    return {
      statusCode: error.httpStatusCode || 500,
      body: JSON.stringify(
        {
          error: error.message,
        },
        null,
        2
      ),
    };
  }
}

exports.handler = handler;
```

</details>
<br>

- Create a `index.njk` file in the root of the project with the [following content](https://github.com/dgrammatiko/webradio/blob/HTML/index.njk)
- Create a `netlify.toml` file in the root of the project with the following content:

<details>
  <summary>netlify.toml</summary>

```toml
[[redirects]]
from = "/"
to = "/.netlify/functions/serverless"
status = 200
force = true
_generated_by_eleventy_serverless = "serverless"
```

</details>
<br>

- Create a `.gitignore` file in the root of the project with the following content:

<details>
  <summary>.gitignore</summary>

```ignore
netlify/functions/serverless/**
!netlify/functions/serverless/index.js
.netlify
node_modules
```

</details>

- run `git init`
- run `git add .`
- run `git commit -m "Some comment goes here"`
- run `git remote add origin git@github.com:username/new_repo` Replace `username` with your GitHub username and `new_repo` with the name of your repo.
- run `git push -u origin master`
- deploy to Netlify

{% imagine 'html_radio.png', 'blog', imageAltText, "(min-width: 30em) 50vw, 100vw", 'full-width' %}

You should have a working Web Radio Player that once the user selects a `country` and `station` the audio element will play the station. Congrats, you have an interactive Web Radio Player implemented with only HTML on the client side.

On the next post we will add some CSS and JS to beatify the UI and also enhance the UX, but HTML is a solid foundation to build on.
