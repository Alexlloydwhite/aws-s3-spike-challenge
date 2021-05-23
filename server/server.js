/** ---------- IMPORTS ---------- **/
const express = require('express');
const app = express();
const fs = require('fs');
const util = require('util');
const { uploadFile, getFileStream } = require('./s3');
const bodyParser = require('body-parser');
const multer = require('multer'); // image storage middleware

/** ---------- MIDDLEWARE ---------- **/
app.use(bodyParser.json()); // needed for axios requests
app.use(express.static('build'));
const upload = multer({ dest: 'uploads/' });
const unlinkFile = util.promisify(fs.unlink);

/** ---------- ROUTERS ---------- **/
// GET this specific image from S3 bucket
app.get('/images/:key', (req, res) => {
    console.log(req.params);
    // The key is how the file(image) exist in S3
    const key = req.params.key;
    const readStream = getFileStream(key);
    // pipe the read stream into the response.
    readStream.pipe(res);
});

// Post image to S3 bucket
app.post('/images', upload.single('image'), async (req, res) => {
    const file = req.file;
    console.log(file);
    // await upload file, pass in file from multer
    // Send file to S3.. wait..
    const result = await uploadFile(file);    
    // delete file once it has been uploaded to S3
    await unlinkFile(file.path);
    console.log(result);
    const description = req.body.description;
    const imagePath = `/images/${result.key}`;
    // when client makes get request to image/fileKEy
    // server will go to S3 and grab the file
    res.send({ imagePath: imagePath })
});

/** ---------- START SERVER ---------- **/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});