const express = require('express');
const app = express();
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5000;

// import multer to handle "middlemanning" image storage
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

/** ---------- MIDDLEWARE ---------- **/
app.use(bodyParser.json()); // needed for axios requests
app.use(express.static('build'));

// Importing functions from S3 module 
const { uploadFile } = require('./s3');

//** ------------ POOL --------------**/
const pg = require('pg');
const Pool = pg.Pool;
const config = {
    database: 'aws-s3-image', // the name of the database
    host: 'localhost', // where is your database
    port: 5432, // the port number for your database, 5432 is the default
    max: 10, // how many connections at one time
    idleTimeoutMillis: 30000 // 30 seconds to try to connect
};
const pool = new Pool(config);

pool.on('connect', (client) => {
    console.log('PG connected');
});

pool.on('error', (err, client) => {
    console.log('unexpected error on idle pg client', err);
});

// ------------ Routes ------------

// HEY S3! Give me this specific image so i can send it to the client
// app.get('/images/:key', (req, res) => {
//     console.log(req.params);
//     // The key is how the file(image) exist in S3
//     const key = req.params.key;
//     const readStream = getFileStream(key);
//     // pipe the read stream into the response.
//     readStream.pipe(res);
// })

app.get('/images', (req, res) => {
    console.log('IN /images');
    const sqlQuery = `SELECT * FROM images;`;
    pool.query(sqlQuery)
        .then(result => {
            res.send(result.rows);
        })
        .catch(err => {
            console.log(`IN get images router, ERROR: ${err}`);
            res.sendStatus(500);
        })
});

// Post image to S3 bucket
app.post('/images', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        console.log(file);

        // await upload file, pass in file from multer
        // Send file to S3.. wait..
        const result = await uploadFile(file);

        // Readability, file description and image path
        const description = req.body.description;
        const imagePath = `/images/${result.key}`;
        // SQL query to insert file into PG
        const sqlQuery = `INSERT INTO images ("imagepath", "description") VALUES ($1,$2);`;
        // post the image path and description to PG
        await pool.query(sqlQuery, [imagePath, description])

        // delete file once it has been uploaded to S3
        await unlinkFile(file.path);
        console.log(result);
    } catch (error) {
        console.log(`IN post router /images. Error posting image:`, error);
    }
})

/** ---------- START SERVER ---------- **/
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});
