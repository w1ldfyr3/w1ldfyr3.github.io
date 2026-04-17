---
layout: post
title: "False Positive"
date: 2025-12-24 20:04:01 GMT+5
categories: [Forensics, Steganography]
tags: [exiftool, base64, steghide, disk image, auctf, strings, fls, icat, openssl, gzip, ROT12]
img_path: /assets/img/posts/false-positive/
---

## Challenge Description:
> "Santa's beach postcard looks picture-perfect - sunshine, smiles, and festive cheer all around. But not everything is as simple as it seems. Beneath the glossy surface, something feels a little heavier than sand. Take a closer look, trust your curiosity, and see what secrets might be hiding where no one thought to look during the holiday rush."

## Challenge Overview:
For this challenge we are give a file named float.jpg. We run exiftool on it and find a password in comments. We apply base 64 decode on it and use it to extract a file hidden inside float.jpg. Then we do forensics on the file to extract the flag.

## Solution:
### Getting the Password:
```console
$ exiftool float.jpg 
ExifTool Version Number         : 13.36
File Name                       : float.jpg
Directory                       : .
File Size                       : 254 kB
File Modification Date/Time     : 2025:12:20 00:11:59+00:00
File Access Date/Time           : 2025:12:24 14:22:01+00:00
File Inode Change Date/Time     : 2025:12:24 14:22:01+00:00
File Permissions                : -rwxrw-rw-
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 1
Y Resolution                    : 1
Comment                         : password:MDYxNzIy
Image Width                     : 3264
Image Height                    : 2448
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:2:0 (2 2)
Image Size                      : 3264x2448
Megapixels                      : 8.0
```
### Base64 De-code:
```console
$ echo 'MDYxNzIy' | base64 -d
061722
```
### Extracting the Secret:
```console
$ steghide extract -sf float.jpg 
Enter passphrase: 061722
wrote extracted data to "disk.img.gz".
```
### Extracting the disk.img:
```console
$ gunzip disk.img.gz 

$ ls
disk.img  float.jpg
```
### Examining the disk:
```console
$ strings disk.img              
mkfs.fat
NO NAME    FAT32   
This is not a bootable disk.  Please insert a bootable floppy and
press any key to try again ... 
RRaA
rrAa
mkfs.fat
NO NAME    FAT32   
This is not a bootable disk.  Please insert a bootable floppy and
press any key to try again ... 
RRaA
rrAa
FLAG    TXT 
yi[i[
This isn't the flag, but here's a scrap that might help: supersecretpassword
/tmp/linux_mnt
lost+found
flag.enc
;Y`G
lost+found
flag.enc
/tmp/linux_mnt
S:Salted__Q
Bo-t_cPF
```
Lets make a note of this passoword: "supersecretpassword"
```console
$ mmls disk.img 
DOS Partition Table
Offset Sector: 0
Units are in 512-byte sectors

      Slot      Start        End          Length       Description
000:  Meta      0000000000   0000000000   0000000001   Primary Table (#0)
001:  -------   0000000000   0000002047   0000002048   Unallocated
002:  000:000   0000002048   0000004095   0000002048   Win95 FAT32 (0x0c)
003:  000:001   0000004096   0000009215   0000005120   Linux (0x83)
004:  -------   0000009216   0000040959   0000031744   Unallocated
```
We can see the output. Lets examine the one starting at 2048.
```console
$ fls -o 2048 -r disk.img 
Cannot determine file system type
```
Hmmm! Nothing.

Lets see what is at 4096.
```console
$ fls -o 4096 -r disk.img
d/d 11:\tlost+found
r/r 13:\tflag.enc
V/V 321:\t$OrphanFiles
```
We found a file flag.enc.
### Extracting the file:
```console
$ icat -o 4096 disk.img 13 > flag.enc

$ ls
disk.img  flag.enc  float.jpg

$ file flag.enc          
flag.enc: openssl enc'd data with salted password
```
Running file on the flag.enc gave the output which shows it is encrypted data with a password.

Lets use the password we found to extract the flag.
```console
$ openssl enc -d -aes-256-cbc -pbkdf2 -iter 10000 \
-in flag.enc -out plainflag.txt -pass pass:supersecretpassword

$ ls
disk.img  flag.enc  float.jpg  plainflag.txt

$ cat plainflag.txt 
��iplainflag.txt��
                  �.�2)�7L�7/3�/I3L*5�kG|2
```
Hmm! Weird. We are getting nothing.
Lets see what type of file is plainflag.txt
```console
$ file plainflag.txt 
plainflag.txt: gzip compressed data, was "plainflag.txt", last modified: Sun Nov  9 15:19:23 2025, from Unix, original size modulo 2^32 25
```
Oh it is a compressed file.
Lets extract the contents.
### Extracting the flag
```console
$ openssl enc -d -aes-256-cbc -pbkdf2 -iter 10000 \
-in flag.enc -out plainflag.gz -pass pass:supersecretpassword

$ ls
disk.img  flag.enc  float.jpg  plainflag.gz  plainflag.txt

$ gunzip plainflag.gz

$ ls
disk.img  flag.enc  float.jpg  plainflag  plainflag.txt

$ cat plainflag    
OIQHT{tz4u_1b_7v3_tf1bu3}
```
The flag is found but it is not in the standard format. We know the format is AUCTF so lets apply ROT12 on it.
```console
$ echo "OIQHT{tz4u_1b_7v3_tf1bu3}" | tr 'A-Za-z' 'M-ZA-Lm-za-l'
AUCTF{fl4g_1n_7h3_fr1ng3}
```
### Flag:
```
AUCTF{fl4g_1n_7h3_fr1ng3}
```
