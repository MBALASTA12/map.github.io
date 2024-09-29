// Initialize the map
const map = L.map('map', {
    zoomControl: false // Disable the default zoom controls
}).setView([6.12108, 125.15882], 13); // Set initial coordinates and zoom level

// Add tile layer to the map (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Initialize state variables
let isPickupChecked = false;
let markers = []; // Marker array to keep track of markers on the map

// Hide pickup card initially
const pickupCard = document.getElementById('pickup-card');
pickupCard.classList.remove('visible'); // Ensure pickup card is hidden initially

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
    moveMarkerToQueryLocation(selected);
});

// Function to move the marker based on the selected query
async function moveMarkerToQueryLocation(query) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (data.length > 0) {
            const bestResult = data[0];
            moveMarker(bestResult.lat, bestResult.lon);
            input.value = ''; // Clear the input
        } else {
            alert('Location not found. Please try another search.');
        }
    } catch (err) {
        console.error('Fetch error:', err);
        alert('Error occurred while searching. Please try again later.');
    }
}

// Function to move the marker to a new location
function moveMarker(lat, lon) {
    if (!lat || !lon) {
        console.error('Invalid coordinates');
        return;
    }

    // Remove existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Add a new marker at the new location
    const marker = L.marker([lat, lon]).addTo(map);
    markers.push(marker);

    // Center the map on the new marker
    map.setView([lat, lon], 15);

    if (!isPickupChecked) {
        updatePickupCard(lat, lon); // Update the pickup card if pickup is not yet confirmed
    }
}

// Function to update the pickup card with address and coordinates
function updatePickupCard(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name || 'Unknown address';
            document.getElementById('pickup-address').textContent = `Address: ${address}`;
            document.getElementById('pickup-coordinates').textContent = `Coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;

            // Slide up the pickup card now that the marker is placed
            slideUpPickupCard();
        })
        .catch(err => {
            console.error('Fetch error:', err);
        });
}

// Function to slide up the pickup card (only after the marker is placed)
function slideUpPickupCard() {
    const pickupCard = document.getElementById('pickup-card');
    pickupCard.classList.add('visible'); // Show the pickup card when a marker is set
}

// Handle "Check" button for pickup confirmation
document.getElementById('check-button').addEventListener('click', function () {
    const address = document.getElementById('pickup-address').textContent;
    const coordinates = document.getElementById('pickup-coordinates').textContent;

    if (address.includes('Unknown') || coordinates.includes('Unknown')) {
        alert('Please set a valid location first.');
        return;
    }

    // Transfer the pickup details to the sliding card
    document.getElementById('confirmed-address').textContent = `Address: ${address}`;
    document.getElementById('confirmed-coordinates').textContent = `Coordinates: ${coordinates}`;

    const slidingCard = document.getElementById('sliding-card');
    slidingCard.style.transform = 'translateY(0)'; // Slide up the confirmed card

    isPickupChecked = true; // Mark pickup as confirmed
    hidePickupCard(); // Hide the pickup card after confirmation
    slideUpDeliveryCard(); // Show the delivery card
});

// Function to hide the pickup card after confirmation
function hidePickupCard() {
    const pickupCard = document.getElementById('pickup-card');
    pickupCard.classList.remove('visible'); // Hide the pickup card after it's confirmed
}

// Function to slide up the delivery card
function slideUpDeliveryCard() {
    const deliveryCard = document.getElementById('delivery-card');
    deliveryCard.classList.add('visible'); // Show the delivery card
}

// Function to update the delivery card with address and coordinates
function updateDeliveryCard(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name || 'Unknown address';
            document.getElementById('delivery-address').textContent = `Delivery Address: ${address}`;
            document.getElementById('delivery-coordinates').textContent = `Delivery Coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            slideUpDeliveryCard(); // Slide up the delivery card with new info
        })
        .catch(err => {
            console.error('Fetch error:', err);
        });
}

// Handle the delivery "Confirm Pabili" button
document.getElementById('check-delivery-button').addEventListener('click', function () {
    const deliveryAddress = document.getElementById('delivery-address').textContent;
    const deliveryCoordinates = document.getElementById('delivery-coordinates').textContent;

    if (deliveryAddress.includes('Unknown') || deliveryCoordinates.includes('Unknown')) {
        alert('Please set a delivery location first.');
        return;
    }

    // Navigate to details.html with query parameters for both pickup and delivery info
    const confirmedPickupAddress = document.getElementById('confirmed-address').textContent;
    const confirmedPickupCoordinates = document.getElementById('confirmed-coordinates').textContent;

    const detailsUrl = `details.html?pickupAddress=${encodeURIComponent(confirmedPickupAddress)}&pickupCoordinates=${encodeURIComponent(confirmedPickupCoordinates)}&deliveryAddress=${encodeURIComponent(deliveryAddress)}&deliveryCoordinates=${encodeURIComponent(deliveryCoordinates)}`;
    window.location.href = detailsUrl; // Navigate to the details page
});

// Add a click event listener to the map to handle taps
map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    moveMarker(lat, lng); // Move the marker to the clicked location
});

// Locate button event listener to move marker to current location
document.getElementById('locate-button').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            moveMarker(lat, lon); // Move marker to user's location
        }, error => {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location. Please enable GPS or location services.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});
