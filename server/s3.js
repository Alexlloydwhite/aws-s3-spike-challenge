// import Dotenv and config it
require('dotenv').config();
// from aws-sdk, import S3
const S3 = require('aws-sdk/clients/s3');
// import file system
const fs = require('fs');

// importing secrets from the ENV
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

// Create new instance of S3 
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
})

// uploads a file to S3
// Takes the file from multer as a param
function uploadFile(file) {
    // create read stream using fs library
    const fileStream = fs.createReadStream(file.path);
    
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    }

    // After function runs =>
    // Uploads to the S3 bucket. 
    return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile;

// downloads a file from S3
// Pass in fileKey from multer
function getFileStream(fileKey) {
    // Give S3 the fileKey and bucket name
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    // tell S3 to give us a read stream that we can return out of this function
    return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;