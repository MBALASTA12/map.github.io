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

// Function to compute the distance using the Haversine formula
function haversineDistance(coords1, coords2) {
    const R = 6371e3; // Earth radius in meters
    const lat1 = coords1.lat * Math.PI / 180;
    const lat2 = coords2.lat * Math.PI / 180;
    const deltaLat = (coords2.lat - coords1.lat) * Math.PI / 180;
    const deltaLon = (coords2.lng - coords1.lng) * Math.PI / 180;

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
