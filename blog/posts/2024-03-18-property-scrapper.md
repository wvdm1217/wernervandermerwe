---
title: 'Finding an apartment: A Property24 Scrapper' 
date: 2024-03-18
url: 'property-scrapper'
layout: 'doc'
---

I built a web scrapper to help me find an apartment on [Property24](https://www.property24.com/).
The final solution can only be appreciated if you understand the journey that led to it.
It started off as a bash script that lived in my terminal, then it became a tiny Alpine container running on my PC, somewhere I deployed it to the cloud and eventually it found an unlikely home on my Android phone.
I also accidentally got my Telegram account banned, my work complex's IP temporarily blocked by Naspers and I Pavloved myself into checking rental properties whenever I get a phone notification.

Also, if you work for Property24, don't sue, you guys are great.
After many iterations and months, I found an apartment and the solution worked exceedingly well.
Every time a new apartment was listed, I got a notification on my phone and the app is opened on the new property automatically or when I clicked the notification.

## Moving

The last few months has been a big change for me. 
I made the decision to move back to my university town and to start a new job as a machine learning engineer.
Finding an apartment in a university town has been super painful to say the least. 
If you were not the first person to contact the realtor your chances of getting the place is slim. 
I needed a solution that would notify me of new apartments as soon as they are listed.
This sent me down a three month rabbit hole of failed apartment viewings and angry coding.

## A Humble Bash Script

Somewhere I decided to open up my browser developer tools to see if Property24 has an API.
