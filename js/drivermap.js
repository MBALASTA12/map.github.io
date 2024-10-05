// Initialize map centered on General Santos City
var map = L.map('map', {
    zoomControl: false, // Remove zoom buttons
}).setView([6.1164, 125.1716], 13); // Coordinates of General Santos City

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a marker for the driver's location
var driverMarker = L.marker([6.1164, 125.1716]).addTo(map); // Initial position

// Function to update the driver's location
function updateDriverLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;

            // Update marker position
            driverMarker.setLatLng([lat, lon]);

            // Center the map on the driver's location
            map.setView([lat, lon], 13);

            // Get the saved delivery details from localStorage
            const saveDeliveryDetails = getsaveDeliveryDetails();

            if (saveDeliveryDetails) {
                // Show the buyLocation on the map using buyCoordinates
                showBuyLocation(saveDeliveryDetails.buyCoordinates);
                
                // Show the total cost (total amount) in the UI
                displayTotalCost(saveDeliveryDetails.totalCost);
            }
        }, function(error) {
            console.error("Error getting location: ", error);
        }, {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}


// Function to receive order details from localStorage and display them
function receiveOrderDetails() {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (orderDetails) {
        // Pass both buyCoordinates and totalCost to displayLocation
        displayLocation(orderDetails.buyCoordinates, orderDetails.totalCost);
        displayTotalCost(orderDetails.totalCost);
        displayOrderDetails(orderDetails);
    } else {
        alert("No order details found.");
    }
}

// Function to display the location on the map using buyCoordinates and show the total cost
function displayLocation(buyCoordinates, totalCost) {
    // If the map is not already initialized, set it up
    if (!map) {
        map = L.map('map').setView([buyCoordinates.lat, buyCoordinates.lng], 15);

        // Load OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    }

    // Add a marker for the buy location
    const marker = L.marker([buyCoordinates.lat, buyCoordinates.lng]).addTo(map);

    // Attach a popup with the total cost to the marker
    marker.bindPopup(`${totalCost}`).openPopup();
}

// Function to display the total cost in the UI
function displayTotalCost(totalCost) {
    const costElement = document.createElement('div');
    costElement.innerHTML = `<h3>Total Cost: ₱${totalCost}</h3>`;
    costElement.style.cursor = 'pointer';
    costElement.onclick = () => showPopup();
    document.body.appendChild(costElement);
}

// Function to display the popup card in full screen when total cost is clicked
function showPopup() {
    document.getElementById('popup').style.display = 'block';
}

// Function to close the popup
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

// Add event listener to close the popup
document.querySelector('.close-popup').addEventListener('click', closePopup);

// Function to display order details in the card
function displayOrderDetails(orderDetails) {
    const orderDetailsElement = document.getElementById('order-details');
    orderDetailsElement.innerHTML = `
        <p><strong>Buy Address:</strong> ${orderDetails.buyAddress}</p>
        <p><strong>Delivery Address:</strong> ${orderDetails.deliveryAddress}</p>
        <p><strong>Total Distance:</strong> ${orderDetails.totalDistance} meters</p>
        <p><strong>Total Cost:</strong> ₱${orderDetails.totalCost}</p>
    `;
}

// Call the function to receive order details when the page loads
window.onload = receiveOrderDetails;
