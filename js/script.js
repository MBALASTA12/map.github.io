  // Function to update the links with address from the URL
  function updateLinksFromURL() {
      const params = new URLSearchParams(window.location.search);

      // Update "Where to Buy" link
      if (params.has('address') && window.location.href.includes('buymap')) {
          const buyAddress = params.get('address');
          const buyLink = document.getElementById('buyLink');
          buyLink.innerText = buyAddress;  // Set the link text to the address

          // Retrieve the coordinates saved for buying
          const buyCoordinates = JSON.parse(localStorage.getItem('buyCoordinates'));
          if (buyCoordinates) {
              console.log('Buy Coordinates from JSON:', buyCoordinates);
          }
      }

      // Update "Delivery" link (if exists)
      if (params.has('address') && window.location.href.includes('deliverymap')) {
          const deliveryAddress = params.get('address');
          const deliveryLink = document.getElementById('deliveryLink');
          deliveryLink.innerText = deliveryAddress;  // Set the link text to the address

          // Retrieve the coordinates saved for delivery
          const deliveryCoordinates = JSON.parse(localStorage.getItem('deliveryCoordinates'));
          if (deliveryCoordinates) {
              console.log('Delivery Coordinates from JSON:', deliveryCoordinates);
          }
      }
  }

  // Call the function when the page loads
  window.onload = updateLinksFromURL;

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
