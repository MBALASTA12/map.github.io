// Initialize the map
const map = L.map('map', {
    zoomControl: false
}).setView([6.12108, 125.15882], 13);

// Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Initialize marker array
let markers = [];

// Function to move marker and update card
function moveMarker(lat, lon, isPickup = true) {
    // Clear previous markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Add new marker
    const marker = L.marker([lat, lon]).addTo(map);
    markers.push(marker);
    map.setView([lat, lon], 15); // Adjust the zoom as necessary

    if (isPickup) {
        // Update Pickup card details and slide it up
        updatePickupCard(lat, lon);
    } else {
        // Update Delivery card details and slide it up
        updateDeliveryCard(lat, lon);
    }
}

// Pickup card update function
function updatePickupCard(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name || 'Unknown address';
            document.getElementById('pickup-address').textContent = `Pickup Address: ${address}`;
            document.getElementById('pickup-coordinates').textContent = `Coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            slideUpPickupCard(); // Slide up the pickup card
        })
        .catch(err => console.error('Error fetching reverse geocode:', err));
}

// Slide up the Pickup card
function slideUpPickupCard() {
    const pickupCard = document.getElementById('pickup-card');
    if (pickupCard) {
        pickupCard.classList.add('visible');
    }
}

// Transfer Pickup card details to Sliding card and hide Pickup card
document.getElementById('check-button').addEventListener('click', function () {
    const pickupAddress = document.getElementById('pickup-address').textContent;
    const pickupCoordinates = document.getElementById('pickup-coordinates').textContent;

    if (!pickupAddress || pickupAddress.includes('Not set')) {
        alert('Please select a pickup location first.');
        return;
    }

    // Transfer details to the sliding card
    document.getElementById('confirmed-address').textContent = pickupAddress;
    document.getElementById('confirmed-coordinates').textContent = pickupCoordinates;

    // Hide Pickup card and show Delivery card
    document.getElementById('pickup-card').style.transform = 'translateY(100%)'; // Hide
    slideUpDeliveryCard(); // Show delivery card

    isPickupChecked = true; // Mark as checked
});

// Slide up the Delivery card
function slideUpDeliveryCard() {
    const deliveryCard = document.getElementById('delivery-card');
    if (deliveryCard) {
        deliveryCard.classList.add('visible'); // Show the delivery card
    }
}

// Delivery card update function
function updateDeliveryCard(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name || 'Unknown address';
            document.getElementById('delivery-address').textContent = `Delivery Address: ${address}`;
            document.getElementById('delivery-coordinates').textContent = `Coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            slideUpDeliveryCard(); // Slide up the delivery card
        })
        .catch(err => console.error('Error fetching reverse geocode:', err));
}

// Confirm Delivery request and navigate to details.html
document.getElementById('check-delivery-button').addEventListener('click', function () {
    const deliveryAddress = document.getElementById('delivery-address').textContent;
    const deliveryCoordinates = document.getElementById('delivery-coordinates').textContent;

    if (!deliveryAddress || deliveryAddress.includes('Not set')) {
        alert('Please select a delivery location first.');
        return;
    }

    // Get pickup details from the sliding card
    const pickupAddress = document.getElementById('confirmed-address').textContent;
    const pickupCoordinates = document.getElementById('confirmed-coordinates').textContent;

    // Construct the details.html URL with parameters
    const detailsUrl = `details.html?pickupAddress=${encodeURIComponent(pickupAddress)}&pickupCoordinates=${encodeURIComponent(pickupCoordinates)}&deliveryAddress=${encodeURIComponent(deliveryAddress)}&deliveryCoordinates=${encodeURIComponent(deliveryCoordinates)}`;
    
    // Navigate to the details page
    window.location.href = detailsUrl;
});

// Event listener for map click to set Pickup or Delivery location
map.on('click', function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    if (!isPickupChecked) {
        // First, set the pickup location
        moveMarker(lat, lon, true); // isPickup = true
    } else {
        // After pickup is confirmed, set the delivery location
        moveMarker(lat, lon, false); // isPickup = false
    }
});
