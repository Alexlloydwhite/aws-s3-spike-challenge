# AWS S3 - Prime Academy Weekend Spike

Duration: 12 hour sprint.

## The Problem

Uploading images is essential in basically every functional and user friendly application.

While it is possible to store image files on a local host or PostgreSQL, there exists a faster and much more scalable method.

## The Solution

AWS S3 allows you to send image data thru nodejs and store it on the cloud.

## The Process

Going into this challenge i had no knowledge of image uploading. To start, i read some guides and documentation on AWS S3. 

I learned that I would need to use the middleware Multer to handle multipart form data being uploaded from the client. Multer handles recieving the data, in this case an image, on the Express/NodeJs server. After researching Multer I learned about AWS S3 and storing files inside of "buckets" on the cloud. After creating an AWS account I set up an S3 bucket with permissions/security to allow my Express server to upload, manipulate, and download to/from the bucket. I created an S3 module on the server. This module works with Multer to grab files and send them to the S3 bucket. Each image has a unique Key which allows us to track the file. Grabbing files form S3 is as simple request to the bucket with the image key.

I set up the app in a very minimal fashion with many comments. 

In the future, I hope to explore saving a reference to the image file on the PostgreSQL database to be able to use this in sequence with AWS.
