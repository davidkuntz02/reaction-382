const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const upload = multer();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Image schema
const imageSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String
});
const Image = mongoose.model('Image', imageSchema);

// Middleware
app.use(bodyParser.json());

// Route to handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    const newImage = new Image({
        name: req.body.imageName, // Use the provided name
        data: req.file.buffer,
        contentType: req.file.mimetype
    });

    newImage.save()
        .then(image => {
            res.status(200).send('Image uploaded successfully');
        })
        .catch(err => {
            res.status(500).send(err);
        });
});



// Route to handle image search
app.get('/search', (req, res) => {
    const searchQuery = req.query.query;

    Image.findOne({ name: searchQuery })
        .then(image => {
            if (!image) {
                console.error('Image not found');
                return res.status(404).send('Image not found');
            }
            res.contentType(image.contentType);
            res.send(image.data);
        })
        .catch(err => {
            console.error('Error finding image:', err);
            res.status(500).send('Error finding image');
        });
});




// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});