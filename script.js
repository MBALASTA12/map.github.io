// Initialize the map
const map = L.map('map', {
    zoomControl: false // Disable the default zoom controls
}).setView([6.12108, 125.15882], 13); // Set initial coordinates and zoom level

// Add tile layer to the map (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to fetch location suggestions from OpenStreetMap
async function fetchSuggestions(query) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`);
    const data = await response.json();
    return data.map(item => ({
        label: item.display_name,
        lat: item.lat,
        lon: item.lon
    }));
}

// Initialize Awesomplete for search input
const input = document.getElementById('search-input');
const awesomplete = new Awesomplete(input, {
    autoFirst: true,
});

// Handle input event for autocomplete suggestions
input.addEventListener('input', async function() {
    const query = this.value;
    if (query.length > 2) {
        const suggestions = await fetchSuggestions(query);
        awesomplete.list = suggestions.map(s => s.label);
    } else {
        awesomplete.list = [];
    }
});

// Handle the selection of an autocomplete suggestion
awesomplete.input.addEventListener("awesomplete-selectcomplete", function(event) {
    const selected = event.text.value;

    // Fetch the first result for the selected address
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selected)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const bestResult = data[0];
                moveMarker(bestResult.lat, bestResult.lon);
                input.value = ''; // Clear the input
            } else {
                alert('Location not found. Please try another search.');
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            alert('Error occurred while searching. Please try again later.');
        });
});

// Initialize a marker array
const markers = [];

// Function to move the marker to a new location
function moveMarker(lat, lon) {
    // Remove existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers.length = 0; // Clear the markers array

    // Add a new marker
    const marker = L.marker([lat, lon]).addTo(map);
    markers.push(marker);
    map.setView([lat, lon], 13);
}

// Search button event listener
document.getElementById('search-button').addEventListener('click', async function() {
    const query = input.value;
    if (query.length > 2) {
        const suggestions = await fetchSuggestions(query);
        if (suggestions.length > 0) {
            const bestResult = suggestions[0];
            moveMarker(bestResult.lat, bestResult.lon);
        } else {
            alert('No suggestions found.');
        }
    } else {
        alert('Please enter at least 3 characters to search.');
    }
});
