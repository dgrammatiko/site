---
title: Child templates
description: Some notes on Joomla's new child templates features
tags: blog, joomla
date: 2022-02-23T15:46:54+00:00
image: dragos-gontariu-uPqqkccQqtk-unsplash.jpg
imageAltText: A child looking at the sea
custom_excerpt: For ages Joomla didn't have any meaningful way to handle user created overrides for templates. Did you changed any file from the template? Possibly your changes will be reverted in the next update. Things have change, now there are child templates and they promise to solve those cases and maybe a few more.
---

Joomla 4.1 supports templates with the ability to create child templates. Actually, the code has already existed since 4.0 and this [Pull Request](https://github.com/joomla/joomla-cms/pull/30192). The UI was missing anything meaningful prior to 4.1, so although the new mode technically was supported, it wasn't exposed to the end-users. The missing UI part will be introduced with [Pull Request](https://github.com/joomla/joomla-cms/pull/32896).

## So, what are child templates?

Child templates basically are templates with only one file: templateDetails.xml.

## How do they work?

A child template has one field named parent in the templateDetails.xml that holds the name of the parent template, eg: `<parent>cassiopeia</parent>`. The MVC part of Joomla is already aware of how to handle child templates, and it works based on inheritability. E.g. if index.php doesn't exist in the child, the parent one will be used. This pattern is applied to the direct entry points of the template, the overrides and also the static file overrides.

## Can any template have child templates?

No, the feature is opt-in, so a template in order to be enabled for child templates should have a field name inheritable with a value 1 in the templateDetails.xml. On top of that, the static assets are expected to be stored in the media folder rather than the template folder. There is a [converter](https://github.com/dgrammatiko/convert-template) that aims to convert templates with very little effort.

## Are there any gotchas we should be aware of?

It depends on your actual code, but here's a list of possible ones:

Static assets with template relative paths: eg `$path = $this->baseurl . '/templates/' . $this->template . '/images/logos/brand-large.svg';` should be written as `'media/templates/administrator/atum/images/logos/brand-large.svg';`
PHP includes shouldn't use the template name from the variable $this->template for the path so the child could load the correct file: eg include `JPATH_ADMINISTRATOR . '/templates/' . $this->template . '/base.php';` should be written as include `JPATH_ADMINISTRATOR . '/templates/atum/base.php'`;

## Are there any Breaking Changes?

The project tried its best to keep maximum backwards compatibility. That said, the template file editor is expected to have some significant changes, so if you have functionality that extends that view, please be aware.

## Why should someone embrace the child templates?

The idea behind the child templates was to enable template updates without breaking any user modified files. In essence, this means a safer environment for the template authors but also for the end-users.
