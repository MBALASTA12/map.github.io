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
input.addEventListener('input', async function () {
    const query = this.value;
    if (query.length > 2) {
        const suggestions = await fetchSuggestions(query);
        awesomplete.list = suggestions.map(s => s.label);
    } else {
        awesomplete.list = [];
    }
});

// Handle the selection of an autocomplete suggestion
awesomplete.input.addEventListener("awesomplete-selectcomplete", function (event) {
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

    // Update the pickup card with address and coordinates
    updatePickupCard(lat, lon);
}

// Function to update the pickup card with address and coordinates
function updatePickupCard(lat, lon) {
    // Fetch address details using reverse geocoding
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name || 'Unknown address';
            document.getElementById('pickup-address').textContent = `Address: ${address}`;
            document.getElementById('pickup-coordinates').textContent = `Coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            slideUpPickupCard(); // Slide up the card
        })
        .catch(err => {
            console.error('Fetch error:', err);
        });
}

// Function to slide up the pickup card
function slideUpPickupCard() {
    const card = document.getElementById('pickup-card');
    card.classList.add('visible'); // Add visible class to show the card
}

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
    // Search button event listener
    document.getElementById('search-button').addEventListener('click', async function () {
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

    // Click event on the map
    map.on('click', function (e) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        moveMarker(lat, lon); // Move the marker and update the card
    });

    // Locate button event listener
    document.getElementById('locate-button').addEventListener('click', function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                moveMarker(lat, lon); // Move the marker to the user's location
            }, error => {
                console.error('Geolocation error:', error);
                alert('Unable to retrieve your location. Please enable GPS or location services.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    });
});

// Handle Check button functionality
document.getElementById('check-button').addEventListener('click', function () {
    const address = document.getElementById('pickup-address').textContent;
    const coordinates = document.getElementById('pickup-coordinates').textContent;

    if (address.includes('Not set') || coordinates.includes('Not set')) {
        alert('Please set a location first.');
        return;
    }

    document.getElementById('confirmed-address').textContent = `Address: ${address}`;
    document.getElementById('confirmed-coordinates').textContent = `Coordinates: ${coordinates}`;

    const slidingCard = document.getElementById('sliding-card');
    slidingCard.style.display = 'block'; // Show the sliding card
    slidingCard.style.top = '60px'; // Position it below the search container
});

// Close button functionality
document.getElementById('close-button').addEventListener('click', function () {
    document.getElementById('sliding-card').style.display = 'none'; // Hide the sliding card
});

