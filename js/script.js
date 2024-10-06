// Function to retrieve and display addresses
function displayAddresses() {
    const buyDetails = JSON.parse(localStorage.getItem('buyDetails'));
    const deliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails'));

    // Display buy address
    if (buyDetails) {
        document.getElementById('buy-address').innerText = buyDetails.address;
    } else {
        document.getElementById('buy-address').innerText = "No buy address selected.";
    }

    // Display delivery address
    if (deliveryDetails) {
        document.getElementById('delivery-address').innerText = deliveryDetails.address;
    } else {
        document.getElementById('delivery-address').innerText = "No delivery address selected.";
    }

    // Call the function to compute distance and cost
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

        // Display the cost and distance on the payment card
        document.getElementById('paymentCost').innerText = `₱${cost}`;
        document.getElementById('totalDistance').innerText = `${distance.toFixed(2)} meters`; // Display distance

        // Show payment card
        document.getElementById('payment-card').style.display = 'block'; // Show payment card
    } else {
        alert("Location details are missing.");
    }
}

// Call the function to display addresses
displayAddresses();

// Haversine formula to calculate distance between two coordinates
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

    return R * c; // Distance in meters
}

// Confirm details function
function confirmDetails() {
    const buyDetails = JSON.parse(localStorage.getItem('buyDetails'));
    const deliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails'));

    if (buyDetails && deliveryDetails) {
        const totalDistance = document.getElementById('totalDistance').innerText;
        const totalCost = document.getElementById('paymentCost').innerText;

        // Create an object to hold all the details
        const confirmationDetails = {
            buyAddress: buyDetails.address,
            buyCoordinates: buyDetails.coordinates,
            deliveryAddress: deliveryDetails.address,
            deliveryCoordinates: deliveryDetails.coordinates,
            totalDistance: totalDistance,
            totalCost: totalCost
        };

        // Send order details to the server
        fetch('/sendOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(confirmationDetails),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Order received successfully') {
                console.log('Order sent successfully');
                showWaitingPopup(); // Show the waiting popup after confirmation
            }
        })
        .catch(error => {
            console.error('Error sending order:', error);
        });

    } else {
        alert("Please ensure all address details are filled out before confirming.");
    }
}

// Function to show the waiting popup
function showWaitingPopup() {
    document.getElementById('waiting-popup').style.display = 'block';
}

// Function to close the waiting popup
function closeWaitingPopup() {
    document.getElementById('waiting-popup').style.display = 'none';
}

// Event listener for the confirmed button
document.getElementById('confirmed-button').addEventListener('click', confirmDetails);
