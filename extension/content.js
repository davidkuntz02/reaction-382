// content.js

// Assuming there's an element on the webpage with id "imageContainer" where you want to display the image
const imageContainer = document.getElementById('imageContainer');

// Function to fetch and display image from MongoDB
function displayImage(imageId) {
    fetch(`http://localhost:3000/search/${imageId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Image not found');
        }
        return response.blob();
    })
    .then(blob => {
        const imageURL = URL.createObjectURL(blob);
        const imageElement = document.createElement('img');
        imageElement.src = imageURL;
        imageContainer.appendChild(imageElement);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}