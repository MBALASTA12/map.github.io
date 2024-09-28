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

let isPickupChecked = false; // Track if the "Check" button has been clicked

// Function to slide up the pickup card
function slideUpPickupCard() {
    if (isPickupChecked) {
        return; // Stop if the card was already checked
    }

    const pickupCard = document.getElementById('pickup-card');
    if (pickupCard) {
        pickupCard.classList.add('visible'); // Show the pickup card

        // Wait for the pickup card to slide up before sliding the delivery card
        setTimeout(() => {
            pickupCard.classList.remove('visible'); // Hide the pickup card

            // Now slide up the delivery card
            slideUpDeliveryCard();
        }, 3000); // Adjust the timeout duration as needed
    } else {
        console.error('Pickup card element not found');
    }
}

// Function to update the delivery card with address and coordinates
function updateDeliveryCard(lat, lon) {
    // Fetch address details using reverse geocoding
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name || 'Unknown address';
            document.getElementById('delivery-address').textContent = `Address: ${address}`;
            document.getElementById('delivery-coordinates').textContent = `Coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            // Delay the delivery card slide-up until the pickup card is hidden
        })
        .catch(err => {
            console.error('Fetch error:', err);
        });
}
// Function to slide up the delivery card
function slideUpDeliveryCard() {
    const deliveryCard = document.getElementById('delivery-card');
    if (deliveryCard) {
        deliveryCard.classList.add('visible'); // Add visible class to show the card
    } else {
        console.error('Delivery card element not found');
    }
}

// Click event on the map for setting delivery location
map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    moveMarker(lat, lon); // Move the marker and update the pickup card
    updateDeliveryCard(lat, lon); // Call this to update and slide up the delivery card
});

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

// Ensure the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function () {

    // Check for check-delivery-button existence
    const checkDeliveryButton = document.getElementById('check-delivery-button');
    if (!checkDeliveryButton) {
        console.error('Check delivery button not found');
    } else {
        checkDeliveryButton.addEventListener('click', function () {
            const deliveryAddress = document.getElementById('delivery-address').textContent;
            const deliveryCoordinates = document.getElementById('delivery-coordinates').textContent;
            const pickupAddress = document.getElementById('pickup-address').textContent;
            const pickupCoordinates = document.getElementById('pickup-coordinates').textContent;

            if (pickupAddress.includes('Not set') || pickupCoordinates.includes('Not set')) {
                alert('Please set a pickup location first.');
                return;
            }

            if (deliveryAddress.includes('Not set') || deliveryCoordinates.includes('Not set')) {
                alert('Please set a delivery location first.');
                return;
            }

            const detailsUrl = `details.html?pickupAddress=${encodeURIComponent(pickupAddress)}&pickupCoordinates=${encodeURIComponent(pickupCoordinates)}&deliveryAddress=${encodeURIComponent(deliveryAddress)}&deliveryCoordinates=${encodeURIComponent(deliveryCoordinates)}`;
            
            window.location.href = detailsUrl; // Navigate to details.html
        });
    }
});

// Check button event listener for Pickup
document.getElementById('check-button').addEventListener('click', function () {
    const address = document.getElementById('pickup-address').textContent;
    const coordinates = document.getElementById('pickup-coordinates').textContent;

    if (address.includes('Not set') || coordinates.includes('Not set')) {
        alert('Please set a location first.');
        return;
    }

    // Show confirmed address and coordinates in the sliding card
    document.getElementById('confirmed-address').textContent = `Address: ${address}`;
    document.getElementById('confirmed-coordinates').textContent = `Coordinates: ${coordinates}`;

    const slidingCard = document.getElementById('sliding-card');
    slidingCard.style.transform = 'translateY(0)'; // Slide up the confirmed card

    isPickupChecked = true; // Mark as checked
});
