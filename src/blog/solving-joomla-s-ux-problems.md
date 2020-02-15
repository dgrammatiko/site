---json
{
  "title": "Solving Joomla’s UX problems",
  "description": "",
  "tags": ["blog", "Joomla"],
  "date": "2018-10-26T11:38:59+00:00",
  "introImage": "/_assets/img/ryan-johnston-124209-unsplash.jpg",
  "introImageAlt": "A tunnel",
  "fulltextImage": "/_assets/img/ryan-johnston-124209-unsplash.jpg",
  "fulltextImageAlt": "A tunnel",
  "custom_excerpt": "Joomla 4.0 is painstakingly crafted by a bunch of people. One of the main areas of improvement was to simplify the convoluted User Experience. So how things are evolving? What’s the plan there?",
  "layout": "blog.njk"
}
---
Joomla is one of three major open source CMSs, which tends to loose users due to the poor interface and the extremely difficult workflows. A very reasonable reason, since no-one (except hardcore mazochists) wants a system that is extremelly weird and needs some deep knowledge to even complete the very simple tasks. But Joomla used to be one of the pioneers in the Content Management a decade ago, so how that system was ruined so badly?

The “Always be yourself” mantra
-------------------------------

Wordpress and Drupal, right from the beginning of their existence, followed a different path than the one the Mambo (the predecessor of Joomla) chose. The architecture of these systems is so vastly different, so any idea that any of these systems could mirror major the other one is damn stupid! To give you a simple example think of Wordpress as an offroad car and Joomla as a lake boat. You can add wheels to the boat but it will never be a **real** car, or you can add some inflatable balloons in the car but it will never be a **real** boat. So it’s better to understand each system for what it trully is and use (or improve) it as such. This is by far the best course of action. Use each system for what it truly is, don’t try to cannibalize it for whatever stupid reason.

> Well Joomla has been cannibalised to the extreme to match the other two major CMSs, with poor results, because in the process people canceled out the principle “form follows function”

Form follows function
---------------------

If you studied design (by the way due to my engineering background I have), you are already familliar with this essential principle. For those not familliar with, let me call it the law, please spent some time to educate yourself, starting here: https://en.wikipedia.org/wiki/Form\_follows\_function. So, you might ask, how the heck an industrial, architecture principle is affecting a softwares program? The answer is obvious, or it should be at least for the so called developers, buildings and softwares share something common: Architecture. But you already knew that, didn’t you?  
What I’m trying to highlight here (maybe spending more time than what is appropriate) is that the three well known CMSs don’t share the same architecture and therefore will never, ever have the same workflows. No matter what gimmicks and shortcuts and other fancy things you throw at them they can only pretend to be something that are not truly are.  
And that is the problem of Joomla: people want the system to become a clone of Wordpress. They don’t like to put it straight forward like that so they came up with a nice wrapper for that: we want Joomla to have the good UX of Wordpress. The problems start to arise when you blindly copying the workflow of something vastly different, thinking that:

> if it works for that system then most probably it will work for us

Hell no!
--------

Yes programmers, in essence, most of the times craft code that replicates, or improves a functionality that some other software already introduced. The real “**new**” and “**unseen”** features are vary rare and most of the times those need some time to be accepted by the majority of developers. What I’m trying to highlight here is that you can implement “your” version of drag and drop to your system and that will be a good “copying” of that feature that another system already had implemented. But there is a caveat here, you as developer have the responsibility to adjust that feature to fit the system and not change the system to fit the feature. And there we go, we reached the root of all UX problems in Joomla:

> New features should embrace the system for what it truly is and NOT try to change it

Combine and concur
------------------

So if someone want to distil this post to a couple lines those will be:

Form always follows function and all features should embrace the system for what it truly is without ever trying to change it’s basic architecture.

Then someone could ask: is Joomla built uppon a good architecture?

Oh, yes! Joomla is using the very familiar tree like organization of the data, visualise it as something similar to the filesystem that your operating system is using. Folders can have subfolders (categories and subcategories) and files (articles, banners, contacts, items, etc). Also this structure is already familiar to all the people using a computer as this data structure is apparent to all operating systems (exception IOS, that very cleverly hides it for the end user, but it’s still there). So, a naïve person could think how the heck a so familliar architecture became so painful for users in Joomla? Well the answer is that by time a gazillion features were added and those features were actually fighting the systemby time over time instead of embracing it and improving it.

Take a step back and start removing the clutter
-----------------------------------------------

I didn’t expect that you make till here, but good news as in this section I’ll try to give you my view of an ultra simplified workflow and therefore a vastly improved user experience. Let’s take com\_content as our point of reference and particularly the edit view:

So what will happen if instead of all the known tabs:

<figure class="graf graf--figure graf-after--p" id="daef"><div class="aspectRatioPlaceholder is-locked"><div class="aspectRatioPlaceholder-fill">Content, Images and Links, Options, Publishing, Configure Edit Screen, Permissions </div></div></figure>we end up only with the essential ones:

<figure class="graf graf--figure graf-after--p" id="229f"><div class="aspectRatioPlaceholder is-locked"><div class="aspectRatioPlaceholder-fill"> Content, Images and Links, Publishing</div></div></figure>Someone could just say “you cannot do that, we’re gonna loose all the flexibility for the displayed article and the ability to control the permissions”

***AND THEY’LL BE F@#$NG WRONG,* probably, because they don’t understand Joomla! 😮.** Remember all these things I wrote above about the tree like architecture? Well that in Joomla comes with another magic word: “inheritance”. Put it simple: all articles under a specific category should have the same properties which are inherited from the category or the menu, if that article is published under a menu item. But my idea goes a little bit further than that. So instead moving those options up to the tree, which obviously will be a great improvement, why not eliminating them all together and leave the display options to the template, as the architecture already dictates. So my complete idea is: have just a layout selector in the article edit (will default to the one that the category should imply, if none was selected) and have a GUI override creator in the template, with a very clear path that user could, effortlessly create the desired design (without even knowing PHP, HTML, JAVASCRIPT or CSS).

Does that seems very hard to achieve? Then try asking if people want green or red button to click as they go away…

EMBRACE WHAT WE FUCKING ARE STOP DRESSING IT UP AS A CLONE
