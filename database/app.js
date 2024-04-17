const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/imageUploader', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Define image schema
const ImageSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String
});

const Image = mongoose.model('Image', ImageSchema);

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve HTML file for image upload
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
    const { name } = req.body; // Retrieve name from request body
    const { originalname, buffer, mimetype } = req.file;
    try {
        const newImage = new Image({
            name: name || originalname, // Use specified name or original filename
            data: buffer,
            contentType: mimetype
        });
        await newImage.save();
        res.send('Image uploaded successfully');
        console.log('Image uploaded successfully');
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).send('Error uploading image');
    }
});

// Serve HTML file for image lookup
app.get('/lookup', (req, res) => {
    res.sendFile(path.join(__dirname, 'lookup.html'));
});

// Handle image lookup
app.get('/image/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const image = await Image.findOne({ name });
        if (!image) {
            console.log('Image not found');
            return res.status(404).send('Image not found');
            
        }
        res.contentType(image.contentType);
        res.send(image.data);
    } catch (err) {
        console.error('Error retrieving image:', err);
        res.status(500).send('Error retrieving image');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
