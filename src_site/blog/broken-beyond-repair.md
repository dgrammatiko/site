---
title: Broken beyond repair‽
description: One year after Joomla v4.0.0 might be an excellent time to write honest opinions about that release. Mainly on the bad things.
tags: blog, Joomla, HTML, CSS, JavaScript
date: 2022-08-10T22:55:54+00:00
image: balint-szabo-wmAyFfBgK2I-unsplash.jpg
imageAltText: Image of a broken window by Bálint Szabó
custom_excerpt: One year after Joomla v4.0.0 might be an excellent time to write honest opinions about that release. Mainly on the bad things.
---

Joomla is getting 17 years old this August (2022). It's great that an open-source project driven by the community still holds a portion of the market share (significantly smaller than it was ten years ago). As tradition wants, it's the perfect time for complaining, expressing gratitude (read: hate, insults) to the contributors, whining, blaming, etc. Well, this post is just a reflection of **my own** failures and mistakes that somehow negatively impact the project or will in the future. Objectively this post will focus mainly on the bad parts of version 4, so an introduction to the good parts will counterbalance the overall negative trend.

## The Good Parts

One of the few things I am proud of it happened under my watch as a Javascript Group Leader was the elimination of jQuery for almost everything in the core. The scope of the JavaScript modernisation task was broadened around 2017 by myself, David Neukirchen and Yves Hoppe to also transition the javascript to ES2015. Later on, when the Bootstrap framework was updated to version 5 by George Wilson and me, I started moving the scripts to be served based on the feature detection of the browsers using the attributes type=module and nomodule. Those changes are the main reason that Joomla 4 performs way better than Joomla 3 on the client side and has a good performance rank in Google's Lighthouse. A handful of people did all the JavaScript work and is the most impactful in terms of performance and maintainability. Oh, yes, I spent quite some time documenting all the external Javascript dependencies, finding the appropriate alternatives that were jQuery-free and then creating the tools to automate the installation, update and bundling project-wide. Also, in my quest to standardise the form fields, especially for the repeatable part, I discovered Web Components (mid-2016) and started implementing most of the fields based on Custom Elements. On top of that, I recognised that this W3C native technology could have been the solution to decouple the CMS from the Bootstrap prison; therefore, I created the [Joomla Custom Elements](https://joomla-projects.github.io/custom-elements/), a collection of interactive elements targeted to replace the ones from Bootstrap. Well, a couple of those made it; the rest are still in a WIP state.

All these sound like bragging about myself, so let's change the mood, should we?

## Marginally missed

Icons! Yes, Joomla is still using icon fonts, although I tried twice (at least) to introduce a nice API that people could register icons, and those were going to insert into the document as SVG. References: [[4.0] [RFC] SVG icons](https://github.com/joomla/joomla-cms/pull/28351) and [[WIP] SVG Icons](https://github.com/joomla/40-backend-template/pull/441)

Fields! As was previously stated, the idea was to make all the interactive fields a Web Component. The thinking behind that idea was that Web Components encapsulate the markup, the styling and the functionality in one javascript file and expose just a simple HTML element. Neat. Unfortunately, the maturity of Web Components is not there, nor was it 4-5 years ago; thus, the fields are still *just* Custom Elements, and most of them have icons that require Font Awesome loaded on the page and worst than that expect the Bootstrap CSS to be present. In short, nothing there screams encapsulation. With little effort, the project could invest resources to decouple the fields from Bootstrap and Font Awesome and instantly become more resilient to future updates. Fields are a point that the production team should consider seriously!

## Missed by a long shot

Bootstrap! It might probably come as a surprise to many, but the implementation of Bootstrap is a big foot gun for the project! Let's see why that is the case.
Joomla introduced Bootstrap v2 with version 3 of the CMS. That was a long time ago, but its implementation was very shortsighted. The mistake made back then and unfortunately not fixed with version 4 is that the framework is not coupled, as expected, to the templates but exists as a global helper. If you still struggle to find the architectural fault here, let me explain it with the actual result that many users experienced trying to upgrade from Joomla v3 to v4. As a case study, let's assume that you own a Joomla 3 site. Suppose you bought one of the many templates based on Bootstrap v2. At the time of the upgrade of Joomla to version 4, Bootstrap, which, as said before, is a global helper, also upgrades to V5. Your template is broken, and unless you are willing to fight all the changes in the markup, CSS, Javascript and even PHP, you're ready to redesign your site on a newly bought template based on Bootstrap version 5!
That was why Ciaran Walsh and I tried and failed to warn the production team that the Bootstrap coupling was wrong, was already creating a substantial backwards compatibility break and would subject the project to more B/C breaks in the future. Is there a remedy, you might ask? The Bootstrap helper and all the assets need to move to the templates. Hard? Not really; at the point where the template is initialised, early in the lifetime of the app, a few lines of code could do the trick, eg

```php
// This is pseudocode!
if (is_file($templateDir . '/helper.php')) {
  // Attach the Bootstrap class and all its functions to HTMLHelper
  include_once($templateDir . '/helper.php');
  $x = new TemplateHelper;
  $x->enableBootstrap();
}
```

Now Bootstrap will never be a hard dependency of the CMS but rather a template dependency, as it should have been right from the start! Joomla keeps updating without breaking any templates, as it's expected to do by everybody in the community. Win!
But that leaves some parts of the CMS in a dodgy position as fundamental building blocks as the form fields have some dependency on Bootstrap. The solution was presented by me six years ago, and some parts already exist in Joomla 4, use the custom elements and write them in a way that is not Bootstrap and Font Awesome dependent. To give a solid example, let's take the form-field media with a hard dependency on the Bootstrap Modals. The solution is simple: use the dialog element that has been supported everywhere for a few months now, together with the available polyfill if there is a need for support from older browsers. Write CSS NOT using Bootstrap classes and embed the icon as SVG or background CSS. That's all; the field will work with Bootstrap, UIKit, Foundation, or any other CSS framework-based templates.

At this point, you might think that I'm biased against Bootstrap; I'm not. Bootstrap is an excellent **scaffolding** tool but not something you want to deploy on your production. Also, you have to consider if the project uses it correctly; hint, it's not and here's the proof [Github Issue](https://github.com/joomla/joomla-cms/issues/38323): on August 17th, they will release 4.2.0, but they failed to update the Bootstrap dependency because Bootstrap 5.2.0 was released on July 19th. Let that sink for a moment; Joomla will stay a minor version of Bootstrap behind the current for six (6!) months. Worst than that, the particular version of Bootstrap is the one that introduces CSS Variables for everything (dark/light themes) and thus hardly needs any precompiler! In short, all the advantages that some product team members evangelised about Bootstrap are not real. The reality is that Bootstrap destroyed Joomla, and it might be time to admit it!

I could have written more examples of failed or failing or expected to fail in the future, but I'm not going to do that now. It's depressing and quite honestly I don't think that it's worth the effort neither is helpful for the project as it just adds to the blamming and whining voices of those who are already complaining. The idea was not to complain but to sed some light to the areas that keep this project on a failing track. Peace and happy birthday Joomla.
