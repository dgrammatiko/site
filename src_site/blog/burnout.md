---
title: Burnout
description: Some notes on developer burnout.
tags: blog, joomla
date: 2024-02-20T23:46:54+00:00
image: niclas-lundin-qGzWty2oBlQ-unsplash.jpg
imageAltText: A completely burnt car
custom_excerpt: "Your GitHub stats graph is too green; you're definitely burned out. Well..."
---

If someone follows random developer Twitter stories, there's quite a lot that could be said about burnout. Why's the burnout happening? What are the symptoms? How can we prevent it? And so on. But I'm not going to write about that. I will write about what people perceive as burnout from some very unsophisticated metrics.

## How does your GitHub contribution graph look like?

{% imagine 'burnout.png', 'blog', 'Am I in a burnout phase', "(min-width: 30em) 50vw, 100vw" %}

It's disheartening to look at a graph like this: `They are burning out because they're coding 24/7/365`. This is a very shallow reading of that graph, only if you are unaware of the GitHub actions and the automation that someone could have set up. For example, my graph looks pretty bad; every day, I create and merge PRs. But that's far from the actual reality; I have actions that automatically make a PR, and if the tests pass, they commit the PR on my behalf. Yes, for the stats, I did the work (because I set up the action and the repositories are in my own name, so the creation/commit of the PRs is in my name). Do you get it? I code a script once that does all the work for me. I'm not doing that work daily.


## This is not nessessarily a burnout

The CI (continuous integration) could do work on behalf of the developer.
{% imagine 'burnout2.png', 'blog', 'Am I in a burnout phase', "(min-width: 30em) 50vw, 100vw" %}


## So what's a good metric

There are ways to determine if someone is in a burnout phase, but they require some prerequisites. You need to know the person and understand how they think and work. Then, particular warning patterns could be detected. Even in that case, it's not always possible to amend some patterns to burnout; it could be personal/family issues or a lack of motivation (we all get unmotivated at some point).
This short post was written because there are pretty some sarcastic tweets about burnout, and I wanted to write some thoughts here instead of yelling to random people on Twitter that the GitHub graph is a lousy metric.

Peace
