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

            // Get the saved delivery details from script.js
            const deliveryDetails = getDeliveryDetails();

            if (deliveryDetails) {
                // Show the buyLocation on the map
                showBuyLocation(deliveryDetails.buyLocation);
                
                // Show the total cost (total amount) in the UI
                displayTotalCost(deliveryDetails.totalCost);
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

// Function to retrieve delivery details from localStorage (from script.js)
function getDeliveryDetails() {
    const deliveryDetails = localStorage.getItem('deliveryDetails');
    if (deliveryDetails) {
        console.log("Delivery details found:", deliveryDetails);
        return JSON.parse(deliveryDetails);
    } else {
        console.error("No delivery details found.");
        return null;
    }
}

// Function to display the buy location on the map
function showBuyLocation(buyLocation) {
    // Assuming the buyLocation has latitude and longitude
    const buyCoordinates = getCoordinatesFromAddress(buyLocation);

    if (buyCoordinates) {
        // Add a marker for the buy location on the map
        var buyMarker = L.marker([buyCoordinates.lat, buyCoordinates.lon]).addTo(map);
        buyMarker.bindPopup("Buy Location: " + buyLocation).openPopup();
    }
}

// Function to display the total cost in the UI
function displayTotalCost(totalCost) {
    // Assuming you have an element in the driver.html to show total cost
    const totalCostElement = document.getElementById('total-cost-display');
    totalCostElement.textContent = `Total Cost: ${totalCost} PHP`;
}

// Call the function to start updating the driver's location
updateDriverLocation();

// Dummy function to get coordinates from an address (you may need to implement this)
function getCoordinatesFromAddress(address) {
    // This is a placeholder function. Implement your own logic to get coordinates from an address.
    // You can use a geocoding service like OpenStreetMap, Google Maps API, etc.
    return {
        lat: 14.5995, // Example latitude
        lon: 120.9842 // Example longitude
    };
}
