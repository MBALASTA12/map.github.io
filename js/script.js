// Function to load both buy and delivery addresses from localStorage
function loadAddresses() {
    const buyAddress = localStorage.getItem('buyAddress');
    const deliveryAddress = localStorage.getItem('deliveryAddress');

    if (buyAddress) {
        const buyLink = document.getElementById('buyLink');
        buyLink.textContent = buyAddress;
    }

    if (deliveryAddress) {
        const deliverLink = document.getElementById('deliveryLink');
        deliverLink.textContent = deliveryAddress;
    }
}

// Call the function to load the addresses when the page loads
window.onload = loadAddresses;

// Function to compute and display the distance and cost
function computeAndDisplayCost() {
    const buyCoordinates = JSON.parse(localStorage.getItem('buyCoordinates'));
    const deliveryCoordinates = JSON.parse(localStorage.getItem('deliveryCoordinates'));

    const buyAddress = localStorage.getItem('buyAddress');
    const deliveryAddress = localStorage.getItem('deliveryAddress');

    if (buyCoordinates && deliveryCoordinates) {
        const distance = calculateDistance(
            buyCoordinates.lat,
            buyCoordinates.lon,
            deliveryCoordinates.lat,
            deliveryCoordinates.lon
        );

        // Cost calculation; adjust the conversion rates as necessary
        const costPerMeter = 1 / 31; // 1 PHP for every 31 meters
        const cost = (distance * costPerMeter).toFixed(2);

        // Display results
        document.getElementById('total-distance').innerText = (distance / 1000).toFixed(2) + " km"; // Display in km
        document.getElementById('total-cost').innerText = cost + " PHP";
        document.getElementById('payment-card').style.display = 'block';

        // Save delivery details in localStorage
        saveDeliveryDetails(buyAddress, deliveryAddress, distance, cost, buyCoordinates, deliveryCoordinates);
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

// Function to save delivery details to localStorage
function saveDeliveryDetails(buyLocation, deliverLocation, totalDistance, totalCost, buyCoordinates, deliveryCoordinates) {
    const saveDeliveryDetails = {
        buyLocation: buyLocation,
        deliverLocation: deliverLocation,
        totalDistance: totalDistance,
        totalCost: totalCost,
        buyCoordinates: buyCoordinates, // Add buy coordinates
        deliveryCoordinates: deliveryCoordinates // Add delivery coordinates
    };

    localStorage.setItem('saveDeliveryDetails', JSON.stringify(saveDeliveryDetails));
    console.log("Delivery details saved:", saveDeliveryDetails);
}

// Event listener for the check button
document.getElementById('check-button').addEventListener('click', function() {
    const buyLocation = document.getElementById('buyLink').textContent;
    const deliverLocation = document.getElementById('deliveryLink').textContent;
    
    // Retrieve total distance and cost values as numbers
    const totalDistance = parseFloat(document.getElementById('total-distance').textContent) || 0;
    const totalCost = parseFloat(document.getElementById('total-cost').textContent) || 0;

    // Retrieve coordinates from localStorage
    const buyCoordinates = JSON.parse(localStorage.getItem('buyCoordinates'));
    const deliveryCoordinates = JSON.parse(localStorage.getItem('deliveryCoordinates'));

    // Save delivery details
    saveDeliveryDetails(buyLocation, deliverLocation, totalDistance, totalCost, buyCoordinates, deliveryCoordinates);
});
