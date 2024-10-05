// Function to update the links with address from the URL
function updateLinksFromURL() {
    const params = new URLSearchParams(window.location.search);
    let buyCoordinates, deliveryCoordinates;

    // Update "Where to Buy" link
    if (params.has('address') && window.location.href.includes('buymap')) {
        const buyAddress = params.get('address');
        const buyLink = document.getElementById('buyLink');
        buyLink.innerText = buyAddress;  // Set the link text to the address

        // Retrieve the coordinates saved for buying
        buyCoordinates = JSON.parse(localStorage.getItem('buyCoordinates'));
        if (buyCoordinates) {
            console.log('Buy Coordinates from JSON:', buyCoordinates);
        }
    }

    // Update "Where to Deliver" link
    if (params.has('deliveryAddress') && window.location.href.includes('deliverymap')) {
        const deliveryAddress = params.get('deliveryAddress');
        const deliveryLink = document.getElementById('deliveryLink');
        deliveryLink.innerText = deliveryAddress;  // Set the link text to the address

        // Retrieve the coordinates saved for delivery
        deliveryCoordinates = JSON.parse(localStorage.getItem('deliveryCoordinates'));
        if (deliveryCoordinates) {
            console.log('Delivery Coordinates from JSON:', deliveryCoordinates);
        }
    }

    // Call computeAndDisplayCost if both coordinates are available
    if (buyCoordinates && deliveryCoordinates) {
        computeAndDisplayCost(buyCoordinates, deliveryCoordinates);
    }
}

// Function to compute the distance using the Haversine formula
function haversineDistance(coords1, coords2) {
    const R = 6371e3; // Earth radius in meters
    const lat1 = coords1.latitude * Math.PI / 180; // Use latitude key
    const lat2 = coords2.latitude * Math.PI / 180; // Use latitude key
    const deltaLat = (coords2.latitude - coords1.latitude) * Math.PI / 180; // Use latitude key
    const deltaLon = (coords2.longitude - coords1.longitude) * Math.PI / 180; // Use longitude key

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// Function to compute and display the distance and cost
function computeAndDisplayCost(buyCoordinates, deliveryCoordinates) {
    if (buyCoordinates && deliveryCoordinates) {
        const distance = haversineDistance(buyCoordinates, deliveryCoordinates);
        const cost = Math.ceil(distance / 31); // Cost calculation (31 meters = 1 PHP)
      
        // Display results
        document.getElementById('total-distance').innerText = (distance / 1000).toFixed(2) + " km"; // Display in km
        document.getElementById('total-cost').innerText = cost + " PHP";
        document.getElementById('payment-card').style.display = 'block';
    } else {
        console.warn('Coordinates for both buy and delivery locations are required to compute the cost.');
    }
}

// Call the function when the page loads
window.onload = updateLinksFromURL;
