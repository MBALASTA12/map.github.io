// Initialize the map
const map = L.map('map').setView([6.12108, 125.15882], 13); // Set initial coordinates and zoom level

// Add tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Variables to hold marker and fee calculations
let pickupMarker = null;
let deliveryMarker = null;
let totalDistance = 0;
const feePer500m = 10; // PHP fee for every 500 meters

// Function to move the marker to a new location
function moveMarker(marker, lat, lon) {
    if (marker) {
        marker.setLatLng([lat, lon]);
    } else {
        return L.marker([lat, lon]).addTo(map);
    }
}

// Click event to place a marker on the map
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    if (!pickupMarker) {
        pickupMarker = moveMarker(pickupMarker, lat, lon);
    } else if (!deliveryMarker) {
        deliveryMarker = moveMarker(deliveryMarker, lat, lon);
        totalDistance = map.distance(pickupMarker.getLatLng(), deliveryMarker.getLatLng());
        computeDeliveryFee(totalDistance);
    }
});

// Compute the delivery fee based on the distance
function computeDeliveryFee(distance) {
    const fee = Math.ceil(distance / 500) * feePer500m;
    document.getElementById('total-fee').innerText = `${fee} PHP`;
    document.getElementById('next-button').style.display = 'block';
}

// Initialize Awesomplete for search input
const input = document.getElementById('search-input');
const awesomplete = new Awesomplete(input, {
    autoFirst: true,
});

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

// Handle the search button click
document.getElementById('search-button').addEventListener('click', function() {
    const address = input.value;

    if (!address) {
        alert('Please enter a location.');
        return;
    }

    // Fetch the first result for the typed address and move the marker there
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
                if (!pickupMarker) {
                    pickupMarker = moveMarker(pickupMarker, bestResult.lat, bestResult.lon);
                } else if (!deliveryMarker) {
                    deliveryMarker = moveMarker(deliveryMarker, bestResult.lat, bestResult.lon);
                    totalDistance = map.distance(pickupMarker.getLatLng(), deliveryMarker.getLatLng());
                    computeDeliveryFee(totalDistance);
                }
                map.setView([bestResult.lat, bestResult.lon], 13);
                pickupMarker.bindPopup(bestResult.display_name).openPopup();
            } else {
                alert('Location not found. Please try another search.');
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            alert('Error occurred while searching. Please try again later.');
        });
});

// Toggle card visibility
const toggleCard = document.getElementById('toggle-card');
const cardBody = document.getElementById('card-body');

toggleCard.addEventListener('click', function() {
    if (cardBody.style.display === "none" || cardBody.style.display === "") {
        cardBody.style.display = "flex"; // Show card body
        toggleCard.innerHTML = "▲"; // Change icon
    } else {
        cardBody.style.display = "none"; // Hide card body
        toggleCard.innerHTML = "▼"; // Change icon
    }
});

// Handle next button click
document.getElementById('next-button').addEventListener('click', function() {
    const note = document.getElementById('note-input').value;
    alert(`Pickup Location: ${pickupMarker.getLatLng()}\nDelivery Location: ${deliveryMarker.getLatLng()}\nTotal Payment: ${document.getElementById('total-fee').innerText}\nNote: ${note}`);
});
