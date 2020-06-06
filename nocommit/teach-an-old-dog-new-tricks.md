---
title: Teach an old dog new tricks
description:
tags: blog, Joomla
date: 2019-05-27T12:46:54+00:00
introImage: /static/img/jamie-street-Zqy-x7K5Qcg-unsplash.jpg
introImageAlt: Dog with glasses hearing very carefully
fulltextImage: /static/img/jamie-street-Zqy-x7K5Qcg-unsplash.jpg
fulltextImageAlt: Dog with glasses hearing very carefully
custom_excerpt: We're living in some really interesting times. Of course, I'm not referring to the COVID-19 pandemic here but rather to the era of constant improvements in the WEB platform.
layout: blog.njk
---
The year (2020) started quite awkwardly. As most of us were about to start fulfilling our dreams and targets for the new year a global epidemic outbreaks. Shortly everybody will be isolated in their homes and try to cope with remote working. Suddenly more free time (no traveling wasting hours etc) was a thing. Nothing new tho for devs, especially for those done some time as freelancers. For many, this was a great time to involve with open source projects and maybe already contributed some lines of code (or docs) to an interesting project. I was involved with Joomla for quite some time and I have quite some lines contributed to the project but lately, I'm kinda distancing my self from it as it gets obese problems and most of the "new features" basically are thingies that don't belong there (imho). One of which was a proposed plugin that was supposed to bring the fairly new attribute `loading` to the images.

## Always code in PHP
Couple of years ago when I had the title `Javascript Group Leader` I was very fortunate to work and collaborate with some amazing people. We did a lot, some of them have my own signature, but mainly it was a collaboration. Visionary people questioning always the current status quo of the Joomla's codebase or workflows. Great times, a lot of unpaid work there by all of us. So one of those teams I was fortunate to be part of was the `backend template` team. Basically three people Charlie Lodder, Ciaran Walsh and me. Mostly Charlie and Ciaran did all the coding transferring design to actual html/css/js code. To cut the story short here the team decided to step down and give the keys to another team that refactored the existing template (to the current version of the backend template 1st quarter 2020). My point is that when this team made their pull request to merge their code I did some comments with one particularly interesting: Don't do calculation on runtime if you can use the database for that! So it seems that Joomla devs are extremely happy to run some PHP code instead of pulling the pre calculated data from the database. That concept was repeated on the pull request that was supposed to bring the attribute `loading="lazy"`. At the beggining I just made a comment when someone suggested that the code should extend to support iframes as a not qood idea and let other people do the usual reviews. 
