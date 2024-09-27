// script.js
const map = L.map('map').setView([6.12108, 125.15882], 13); // Set initial coordinates and zoom level

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Add a marker to the map
const marker = L.marker([6.12108, 125.15882]).addTo(map);

// Function to move the marker to a new location
function moveMarker(lat, lon) {
    marker.setLatLng([lat, lon]);
    map.setView([lat, lon], 13);
}

// Example: Move marker to new location after 3 seconds
setTimeout(() => {
    moveMarker(6.125, 125.16); // Replace with actual coordinates
}, 3000);
