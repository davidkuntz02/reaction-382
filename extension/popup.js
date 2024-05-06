document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('uploadButton').addEventListener('click', uploadImage);
});

function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    const imageName = document.getElementById('imageName').value;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('imageName', imageName);

    fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        return response.text();
    })
    .then(data => {
        alert(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}





document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('searchButton').addEventListener('click', searchImage);
});

function searchImage() {
    const searchQuery = document.getElementById('searchQuery').value;

    fetch(`http://localhost:3000/search?query=${searchQuery}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Search failed');
        }
        return response.blob();
    })
    .then(blob => {
        const imageURL = URL.createObjectURL(blob);
        const imageElement = document.createElement('img');
        imageElement.src = imageURL;
        document.getElementById('imageContainer').appendChild(imageElement);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.getElementById('toggleMode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});