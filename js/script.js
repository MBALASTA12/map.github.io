// Function to load both buy and delivery addresses from localStorage
function loadAddresses() {
    // Get the stored buy address and delivery address from localStorage
    const buyAddress = localStorage.getItem('buyAddress');
    const deliveryAddress = localStorage.getItem('deliveryAddress');

    // Replace the "Where to Buy" text if a buy address is found
    if (buyAddress) {
        const buyLink = document.getElementById('buyLink');
        buyLink.textContent = `${buyAddress}`;
    }

    // Replace the "Where to Deliver" text if a delivery address is found
    if (deliveryAddress) {
        const deliverLink = document.getElementById('deliveryLink');
        deliverLink.textContent = `${deliveryAddress}`;
    }
}

// Call the function to load the addresses when the page loads
window.onload = loadAddresses;

// Function to compute and display the distance and cost
function computeAndDisplayCost() {
    const buyCoordinates = JSON.parse(localStorage.getItem('buyCoordinates'));
    const deliveryCoordinates = JSON.parse(localStorage.getItem('deliveryCoordinates'));

    if (buyCoordinates && deliveryCoordinates) {
        const distance = calculateDistance(
            buyCoordinates.lat,
            buyCoordinates.lon,
            deliveryCoordinates.lat,
            deliveryCoordinates.lon
        );

        // Convert distance to PHP
        const cost = (distance / 500) * 11;

        // Display the results
        document.getElementById('total-distance').innerText = distance.toFixed(2);
        document.getElementById('total-cost').innerText = cost.toFixed(2);
        document.getElementById('payment-card').style.display = 'block'; // Show the payment card
    } else {
        alert("Coordinates not found. Please save both buy and delivery coordinates.");
    }
}

// Function to calculate the distance using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Radius of the Earth in meters
    const φ1 = lat1 * Math.PI / 180; // φ in radians
    const φ2 = lat2 * Math.PI / 180; // φ in radians
    const Δφ = (lat2 - lat1) * Math.PI / 180; // Δφ in radians
    const Δλ = (lon2 - lon1) * Math.PI / 180; // Δλ in radians

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Call this function when the page loads to compute the cost
computeAndDisplayCost();
