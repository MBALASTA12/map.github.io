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

// Click event to place a marker on the map
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    moveMarker(lat, lon);
});

// Handle search button click
document.getElementById('search-button').addEventListener('click', function() {
    const address = document.getElementById('search-input').value;

    // Use OpenStreetMap Nominatim API to geocode the address
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const bestResult = data[0];
                const latLng = [bestResult.lat, bestResult.lon];

                // Move marker to the searched location
                moveMarker(bestResult.lat, bestResult.lon);
                // Optionally, you can open a popup with the address
                marker.bindPopup(bestResult.display_name).openPopup();
            } else {
                alert('Location not found. Please try another search.');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error occurred while searching. Please try again later.');
        });
});
