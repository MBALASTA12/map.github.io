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

// Initialize Awesomplete for search input
const input = document.getElementById('search-input');
const awesomplete = new Awesomplete(input, {
    autoFirst: true,
});

// Function to fetch location suggestions
async function fetchSuggestions(query) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.map(item => item.display_name);
}

// Handle input event for autocomplete
input.addEventListener('input', async function() {
    const query = this.value;
    if (query.length > 2) {
        const suggestions = await fetchSuggestions(query);
        awesomplete.list = suggestions;
    } else {
        awesomplete.list = [];
    }
});

// Handle search button click
document.getElementById('search-button').addEventListener('click', function() {
    const address = input.value;

    if (!address) {
        alert('Please enter a location.');
        return;
    }

    // Use OpenStreetMap Nominatim API to geocode the address
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length > 0) {
                const bestResult = data[0];
                moveMarker(bestResult.lat, bestResult.lon);
                marker.bindPopup(bestResult.display_name).openPopup();
            } else {
                alert('Location not found. Please try another search.');
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            alert('Error occurred while searching. Please try again later.');
        });
});
