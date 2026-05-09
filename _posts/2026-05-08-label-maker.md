---
title: Label Maker - Fixing a mistake!
layout: post
date: 2026-05-08
image: /assets/img/city-night.jpeg
---


# So...

Not too long ago I was helping my family out in our retail grocery store, and over the summer while looking for internships I wanted to work on a cool project. I realized I could help my family business by making a simple shelf label automation to automate handwritten labels and eliminate inconsistent writing. Now if you have no idea what shelf labels are, I think it's about time you go to the nearest retail store in person and not Uber everything to your home. But this is what I mean:

![Image of a shelf with price labels](https://imgproxy.divecdn.com/Yl_Qe3zv9VZq7smscIaQ0jQPG_KdUQX3dFMLbn-TVa8/g:ce/rs:fill:1200:675:1/Z3M6Ly9kaXZlc2l0ZS1zdG9yYWdlL2RpdmVpbWFnZS9JTUdfOTc3Ny5qcGc=.webp)

I did some digging and found some free, open-source solutions that would fix our problem. However, just because something is free and open-source does not mean it's the right solution for you. The complexity of these software was not appealing to users who have never seen a button with 0 padding, so for them I made a simple one page label maker with [WYSIWYG](https://www.google.com/search?q=WYSIWYG). This was my solution:

![Image of the software's UI](assets/img/label-maker-ui.png)

I know it's not what you might expect, and this was back when I was still learning about coding so it was a big achievement. Now I will admit this was when AI was getting good at auto completing code. Leveraging that, I carried on asking, spending the 9-10 at work and then 10-12 on this for 4 days for the last 2 weeks of my summer break. Now I had a business neighbor, call him John, ask me "Hey! Mann I saw your shelf labels, can I ask what app are you using to make those?" "Yeah, I made my own app, if you want I can install it on your laptop" I said. "Oh, that would be awesome" said John and walked away. That afternoon I loaded up my single file Python app converted into an exe and loaded it into a USB drive and walked to his store, sat down to install. The loading bar showed 0, 10, 16, and done. Now I hand the computer back to John and ask him to open up the program. He double clicks, we wait for `30 sec` and `Warning: Missing dependency!!`

![Meme](https://miro.medium.com/v2/resize:fit:1008/format:webp/1*qopFE-Az69KVOJM-MPn9vA.jpeg)

Now that was an "It works on my computer" moment and it hits me maybe I should have done more research. For those more senior reading this, you've probably realized as soon as I said Python app, "What? Why Python?" Good question. IDK.

## Learning from the mistake

Now this summer I have gotten my hands on a receipt printer and I thought what if we could also print labels on here, and I have now decided to rewrite my whole code with structure and also in `golang`. Why?

![Meme](https://hacks.mozilla.org/wp-content/uploads/2019/02/successrust-250x250.jpg)

### Stay Tuned for more... I'll be updating this post soon.
