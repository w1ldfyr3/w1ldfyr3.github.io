---
layout: post
title: "The Missing Half"
date: 2025-12-24 13:22:36 GMT+5
categories: [CTF, Forensics, Steganography]
tags: [disk image, dd, strings, auctf]
img_path: /assets/img/posts/the-missing-half/
---

## Challenge Description:
> Santa&#x27;s beachside hard drive has a mystery: a holiday secret split in two. One piece is easy to spot, basking in the sun, while the other has slipped beneath the waves and faded from view. Dig a little deeper, chase what was left behind, and reunite the fragments to uncover what this festive system tried to forget.

## Challenge Overview:
 We were given a file called TheMissingHalf.dd.

The challenge could be solved by simply running strings on the file.

### Solution:
```console
-$ strings TheMissingHalf.dd| grep AUCTF
Output: AUCTF{Part1_ezyyy_t0_f1nd_
```
```console
-$ strings TheMissingHalf.dd| grep part2
Output: 
```
```console
-$ strings TheMissingHalf.dd| grep Part2
Output: Part2_l0st_1n_th3_syst3m}
```

### Final Flag:
```
AUCTF{Part1_ezyyy_t0_f1nd_Part2_l0st_1n_th3_syst3m}
```
