// Function to retrieve and display addresses
function displayAddresses() {
    const buyDetails = JSON.parse(localStorage.getItem('buyDetails'));
    const deliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails'));

    // Check if buy details exist
    if (buyDetails) {
        document.getElementById('buy-address').innerText = buyDetails.address;
    } else {
        document.getElementById('buy-address').innerText = "No buy address selected.";
    }

    // Check if delivery details exist
    if (deliveryDetails) {
        document.getElementById('delivery-address').innerText = deliveryDetails.address;
    } else {
        document.getElementById('delivery-address').innerText = "No delivery address selected.";
    }

    // Call to compute the distance and cost after displaying addresses
    computeDistanceAndCost();
}

// Function to compute distance and cost
function computeDistanceAndCost() {
    const buyDetails = JSON.parse(localStorage.getItem('buyDetails'));
    const deliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails'));

    // Ensure buy and delivery details are available
    if (buyDetails && deliveryDetails) {
        const lat1 = buyDetails.coordinates.lat;
        const lng1 = buyDetails.coordinates.lng;
        const lat2 = deliveryDetails.coordinates.lat;
        const lng2 = deliveryDetails.coordinates.lng;

        // Calculate the distance in meters
        const distance = calculateDistance(lat1, lng1, lat2, lng2);

        // Convert distance to cost (31 meters = 1 PHP)
        const cost = (distance / 31).toFixed(2);

        // Display the cost on the payment card
        document.getElementById('paymentCost').innerText = `₱${cost}`;
        document.getElementById('totalDistance').innerText = `${distance.toFixed(2)} meters`;
    } else {
        alert("Location details are missing.");
    }
}

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180; // Convert degrees to radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Return distance in meters
}

// Call the function to display addresses
displayAddresses();
