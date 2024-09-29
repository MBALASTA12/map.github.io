// map.js
// Initialize the map and set its view to General Santos City (latitude: 6.1164, longitude: 125.1716)
const map = L.map('map').setView([6.1164, 125.1716], 13); // Zoom level 13

// Load and display the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
