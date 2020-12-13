---
title: No more cookies please
description: A simple how-to for eliminating cookies in Joomla 3
tags: blog, Joomla
date: 2018-10-28T10:06:53+00:00
image: /static/img/alex-loup-606850-unsplash.jpg
imageAltText: Hand holding a cookie
custom_excerpt: Monolithic applications, like PHP CMS', usually need a way to synchronise the state of the client [browser] with their own, but there are cases that a stateless application will work fine. Let's explore how we can achieve a cookieless Joomla instance
---
This website is just a blog and therefore having a popup banner asking approval for some cookies wasn't really a user experience I had in my mind. The site is build using Joomla 3.x so a cookie is **always** created no matter what. Well, let's change that because quite frankly I really hate when things are dictated.

 Create a system plugin and use the onAfterRender event:


```php
public function onAfterRender() {
  /* The logic goes here */
}
```


The logic inside the onAfterRender function should be:

Get a reference of the application instance:

```php
$app = Factory::getApplication();
```

Make sure that you remove the cookies only for the front end:

```php
if ($app->isClient('site') !== true) {
  return;
}
```

And manipulate the cookie like:

```php
setcookie(
  Factory::getSession()->getName(),
  '',
  time() - 3600, $app->get('cookie_path', '/'),
  $app->get('cookie_domain'),
  $app->isSSLConnection()
);
```

ATTENTION
---------

Please do not apply this patch if your website **NEEDS** to synchronise the front end user with the one in the back end (eg some shopping cart, or any site that requires a login and has to preserve the guess user state and transfer data to the logged in user.

If you don't understand the above sentence **DO NOT TRY THIS AT HOME**.
