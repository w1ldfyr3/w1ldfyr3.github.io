---
title: "Stars, Stripes and Dumplings"
date: 2025-12-21 17:00:00 +0500
categories: [CTF, OSINT]
tags: [osint, auctf]
---

## Challenge Overview

The challenge **“Stars, Stripes and Dumplings”** was an OSINT task where we were given task  to identify a restaurant.

---

## Step 1: Interpreting the Hints

The first two hints were vague, but the third hint clearly stated:

> *He's part of the Melbourne Chess Collective*

Another hint referenced **Facebook**, so the search moved there.

![Facebook profile search](/assets/img/posts/stars-stripes-dumplings/1.png){: .shadow }
![Facebook profile search](/assets/img/posts/stars-stripes-dumplings/2.png){: .shadow }
---

## Step 2: Identifying the Person

Combining the clues:
- American
- Santa Claus reference
- Melbourne Chess Collective

This led directly to **America Claus**.

![America Claus profile](/assets/img/posts/stars-stripes-dumplings/3.png){: .shadow }

---

## Step 3: The Dumplings Clue

The title hinted at **Dumplings**, so attention was shifted to food-related posts on the profile.
![Celestial Ave text](/assets/img/posts/stars-stripes-dumplings/4.png){: .shadow }
Zooming into one image revealed text on a wall:

> **Celestial Ave**

![Celestial Ave text](/assets/img/posts/stars-stripes-dumplings/5.png){: .shadow }

---

## Step 4: Geolocation via Google Maps

Searching **Celestial Ave, Melbourne** on Google Maps showed multiple restaurants.

Using **Street View**, the image was matched visually.

![Google Street View ](/assets/img/posts/stars-stripes-dumplings/google.webp){: .shadow }

---

## Step 5: Last Step

The Crane restaurant matched perfectly with the Facebook image.

![The Crane restaurant](/assets/img/posts/stars-stripes-dumplings/6.png){: .shadow }

---

## Final Flag

`AUCTF{The_Crane}`
