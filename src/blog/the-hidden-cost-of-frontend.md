<<<<<<< HEAD:src/blog/the-hidden-cost-of-frontend.md
---json
{
  "title": "The hidden cost of Frontend",
  "description": "",
  "tags": ["blog", "Joomla"],
  "date": "2019-03-16T19:02:40+00:00",
  "introImage": "/_assets/img/riccardo-annandale-140624-unsplash.jpg",
  "introImageAlt": "",
  "fulltextImage": "/_assets/img/riccardo-annandale-140624-unsplash.jpg",
  "fulltextImageAlt": "",
  "custom_excerpt": "Joomla 3.9 introduced a new feature for content privacy which is a great addition to the tools provided out of the box but, after 4 patches and countless mentions for it, still has a flaw. A major one...",
  "layout": "blog.njk"
}
=======
---
title: The hidden cost of Frontend
description: 
tags: blog, Joomla
date: 2019-03-16T19:02:40+00:00
introImage: /static/img/riccardo-annandale-140624-unsplash.jpg
introImageAlt: 
fulltextImage: /static/img/riccardo-annandale-140624-unsplash.jpg
fulltextImageAlt: 
custom_excerpt: Joomla 3.9 introduced a new feature for content privacy which is a great addition to the tools provided out of the box but, after 4 patches and countless mentions for it, still has a flaw. A major one...
layout: blog.njk
>>>>>>> ab1d657801479675f6decb3576be72a6ff9ec3a0:src_site/blog/the-hidden-cost-of-frontend.md
---
The idea for this post came from a tweet of a friend expressing gratitude towards all the people that worked to deliver this feature to the community. I stupidly responded with "Especially for those Mootools Modals..." and this response caused a chained reaction. So I guess I had to express myself a little bit more and since Twitter is kinda forbidden for such things this post was more appropriate.

Value and cost
--------------
Steve Jobs has said it very nicely a few years ago when he was asked about the prices of Apple's products value is not price. Of course, Joomla is a free product so there is no price but there is value. To put it plain simple: how valuable is a feature or a collection of features to the users is something that should drive the introduction of those new features. And in this case, someone can easily assume that due to the fact that European sites need to comply with GDPR these tools/features are really valuable. No arguments here. But then my question will be: "valuable at any cost?"

Almost all websites have a hidden cost known to all frontend devs as performance cost. The more things you add in your page usually reflect to worse performance marks. And here is your hidden cost that originates in this feature (and could have been eliminated right from the first beta). The user consent and privacy plugins both have a modal that is not using the already loaded libraries of Bootstrap and jQuery but they are loading yet another library (Mootools) and another modal script. Total size cost: around 200kb. Performance cost per page: over 1-second delay on top of the known delay due to Bootstrap and jQuery of more than 2 seconds (values reflect 3G emulation on Google's Lighthouse).

  
Ok, so it's a bit slower, so what.
-------------------------------------

Right, the point is not that it's a bit slower rather that it's passing the 3 seconds mark. Why? Because studies proved that over 50% of the visitors will abandon a page if it takes more than 3 seconds. Now let's do the math again: over half of the visitors will abandon the registration page because someone enabled this brand new feature. Personally, I find this quite unacceptable but then again I was expressing my concerns since the alpha stage.

So the idea: "Rule #0: the damn thing needs to be delivered, not be perfect for the purists." is totally unacceptable if the "not be perfect" ruins your SEO, ROI and ultimately the product itself. The front end was always treated like a 3rd world citizen in this project and if that won't stop with version 4 I foresee that Joomla will be steadily becoming more irrelevant...
