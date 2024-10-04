  // Function to parse URL parameters, display the address, and save coordinates as JSON
  function displayBuyDetailsFromURL() {
      const params = new URLSearchParams(window.location.search);

      // Check if the required parameters are present
      if (params.has('address') && params.has('lat') && params.has('lng')) {
          const address = params.get('address');
          const lat = params.get('lat');
          const lng = params.get('lng');

          // Display only the address in the "Where to Buy" section
          document.getElementById('buyDetails').innerText = `Address: ${address}`;

          // Create a JSON object to store the coordinates
          const coordinates = {
              latitude: lat,
              longitude: lng
          };

          // Save the coordinates as a JSON string in localStorage
          localStorage.setItem('coordinates', JSON.stringify(coordinates));

          // You can also log the coordinates object if needed
          console.log('Coordinates saved:', coordinates);
      } else {
          // If no details are found, display a default message
          document.getElementById('buyDetails').innerText = "No location selected yet.";
      }
  }

  // Call the function when the page loads
  window.onload = displayBuyDetailsFromURL;

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
