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
        console.error("No delivery details found in localStorage.");
        alert("No delivery details found!");
        return null;
    }
}

// Example usage of retrieved details
const details = getDeliveryDetails();
if (details) {
    // Update the UI with the details
    document.getElementById('deliveryDetails').textContent = details.deliveryDetails;
}

// Function to display the buy location on the map
function showBuyLocation(buyLocation) {
    // Get the coordinates for the buy location (using a placeholder for now)
    const buyCoordinates = getCoordinatesFromAddress(buyLocation);

    if (buyCoordinates) {
        // Add a marker for the buy location on the map
        var buyMarker = L.marker([buyCoordinates.lat, buyCoordinates.lon]).addTo(map);
        buyMarker.bindPopup("Buy Location: " + buyLocation).openPopup();
    }
}

// Function to display the total cost in the UI
function displayTotalCost(totalCost) {
    const totalCostElement = document.getElementById('total-cost-display');
    totalCostElement.textContent = `Total Cost: ${totalCost} PHP`;
}

// Call the function to start updating the driver's location
updateDriverLocation();

// Dummy function to get coordinates from an address (replace with an actual geocoding service)
async function getCoordinatesFromAddress(address) {
    const response = await fetch(`https://api.example.com/geocode?address=${encodeURIComponent(address)}`);
    const data = await response.json();
    
    if (data && data.results && data.results.length > 0) {
        return {
            lat: data.results[0].geometry.location.lat,
            lon: data.results[0].geometry.location.lng
        };
    } else {
        console.error("Geocoding failed for address:", address);
        return null; // Handle the error appropriately
    }
}
