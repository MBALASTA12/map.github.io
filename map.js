// map.js
// Initialize the map and set its view to General Santos City (latitude: 6.1164, longitude: 125.1716)
const map = L.map('map', {
    zoomControl: false // Disable the zoom buttons
}).setView([6.1164, 125.1716], 13); // Zoom level 13

// Load and display the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Search location function using Nominatim API
function searchLocation() {
    const location = document.getElementById('location-search').value;
    
    // Use Nominatim API for searching locations
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                // Get the first result's latitude and longitude
                const lat = data[0].lat;
                const lon = data[0].lon;
                
                // Move the map to the searched location
                map.setView([lat, lon], 13);
            } else {
                alert("Location not found");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error searching for location");
        });
}
