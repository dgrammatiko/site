---
title: Fight the bloatwares
description: "I made a thing: a pwa that creates a Joomla plugin to eliminate bloated extensions"
tags: blog, Joomla
date: 2019-03-27T12:46:54.000+00:00
image: screenshot_2019_03_26.jpg
imageAltText: Screenshot of the application
custom_excerpt: According to urbandictionary.com, the term is described as software
  that comes piggy-backed on other software installations. Bloatware usually includes
  toolbars desktop widgets or external unrelated applications. Most piggy-backing
  bloatware can perform a mundane task that is generally non-essential to everyday
  computer use.
---
Google Android devices and Microsoft Windows personal computers usually are heavily loaded with a plethora of software that the user never bought or asked for. This happens mostly due to some profit that the phone or pc manufacturers are gaining by allowing some software to be preinstalled on their machines. There are few downsides on this, namely the space that is occupied by those applications and (or) the time that the user needs to spend to remove them to get a clean system. Also, it's relatively safe to presume that this is an awful practice and if you can avoid the trap of bloatware is something that you should always consider.

Now hoping to the Content Management Systems, we'll find that Joomla for no apparent reason has become bad bloatware. Do you need to set up a simple site without ever using advertisements? Well, Joomla doesn't care thus will install the component and modules required for ads. Just on the course of version 3, the CMS expanded notably. Looking at the version 4 repo the pattern is continued, and more bloat is always installed without even asking the user if they needed it.

Another very disappointing fact is that you cannot uninstall any of the possible unneeded components/modules/plugins/templates as these will reappear in the next update (not to mention that if you delete the related database tables, the update will just fail miserably).

The solution here is called distributions, Linux is doing that for years, and also Drupal had quite some success using this pattern. Is it possible? Yes, all and all the only thing that is needed is to rearrange the repo so you get the core part which is the base of the system and then all the other stuff can be installed as add-ons (e.g. com_banners, mod_wrapper, etc.). Joomla at some point had the idea to separate the repos (e.g. com_weblinks) but obviously, this is the wrong approach, the solution is to convert the main repo to a Monorepo, the most popular software are already transitioned to monorepos...

Now the realistic part is that this won't happen anytime soon, (if it will ever happen) so what could be the remedy, especially for people that using this bloatware, sorry I mean software, to do multiple installations per day? Here comes Javascript to save the day.

I've created [an SPA](https://dgrammatiko.github.io/on-a-diet/ "Open the removeFat application") (Single Page Application) that illustrates all the possible components/modules/plugins/templates that come preinstalled on each Joomla. Also, it gives you the ability to select which ones to disable and then will create a simple Joomla plugin that you can install directly after installing Joomla and disable things en mass! Another good part is that the plugin will uninstall itself after disabling all the components, plugins, modules, templates. Since this SPA is running and doing all its hard work in your browser, there is no data exchanged.
