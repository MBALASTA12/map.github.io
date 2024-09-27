// Initialize the map inside the compact app container
const map = L.map('map').setView([6.12108, 125.15882], 13); // Set initial coordinates and zoom level

// Add tile layer to the map (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Add a marker for testing purposes
let marker = L.marker([6.12108, 125.15882]).addTo(map);

// Function to move the marker to a new location
function moveMarker(lat, lon) {
    marker.setLatLng([lat, lon]);
    map.setView([lat, lon], 13);
}

// GPS Button to move the map to user's current location
document.getElementById('gps-icon').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            moveMarker(lat, lon);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Click event to place a marker on the map and fill the pickup/delivery locations
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    moveMarker(lat, lon);

    const pickupInput = document.getElementById('pickup-location');
    const deliveryInput = document.getElementById('delivery-location');

    if (!pickupInput.value) {
        pickupInput.value = `Lat: ${lat}, Lon: ${lon}`;
    } else {
        deliveryInput.value = `Lat: ${lat}, Lon: ${lon}`;
        enableCompleteButton();
    }
});

// Enable the complete button if both locations are filled
function enableCompleteButton() {
    const pickup = document.getElementById('pickup-location').value;
    const delivery = document.getElementById('delivery-location').value;
    
    if (pickup && delivery) {
        const button = document.getElementById('complete-button');
        button.classList.add('enabled');
        button.disabled = false;

        button.addEventListener('click', function() {
            sendRequestToAdmin();
        });
    }
}

// Simulate sending data to the admin channel
function sendRequestToAdmin() {
    const pickupLocation = document.getElementById('pickup-location').value;
    const deliveryLocation = document.getElementById('delivery-location').value;
    const additionalNote = document.getElementById('additional-note').value;
    const totalAmount = document.getElementById('total-amount').innerText;

    const message = `Request Details:
    Pickup Location: ${pickupLocation}
    Delivery Location: ${deliveryLocation}
    Total Amount: ${totalAmount}
    Additional Note: ${additionalNote}`;

    console.log("Sending to Admin Channel:", message);
    alert("Request Sent!");
}
