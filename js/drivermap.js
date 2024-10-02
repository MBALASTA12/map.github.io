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

            // Get the saved delivery details from localStorage
            const saveDeliveryDetails = getsaveDeliveryDetails();

            if (saveDeliveryDetails) {
                // Show the buyLocation on the map using buyCoordinates
                showBuyLocation(saveDeliveryDetails.buyCoordinates);
                
                // Show the total cost (total amount) in the UI
                displayTotalCost(saveDeliveryDetails.totalCost);
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

// Function to retrieve delivery details from localStorage
function getsaveDeliveryDetails() {
    const saveDeliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails')); // Correct key name

    if (saveDeliveryDetails) {
        console.log("Retrieved delivery details:", saveDeliveryDetails);

        // Use the details as needed
        const buyLocation = saveDeliveryDetails.buy.address; // Adjusted based on the save structure
        const deliverLocation = saveDeliveryDetails.delivery.address; // Adjusted based on the save structure
        const totalDistance = saveDeliveryDetails.distance; // Adjusted based on the save structure
        const totalCost = saveDeliveryDetails.cost; // Adjusted based on the save structure
        const buyCoordinates = saveDeliveryDetails.buy.coordinates; // Adjusted based on the save structure
        const deliveryCoordinates = saveDeliveryDetails.delivery.coordinates; // Adjusted based on the save structure

        // You can return these details if needed
        return {
            buyLocation,
            deliverLocation,
            totalDistance,
            totalCost,
            buyCoordinates,
            deliveryCoordinates
        };
    } else {
        console.log("No delivery details found in localStorage.");
        return null;
    }
}

// Function to display the buy location on the map using buyCoordinates
function showBuyLocation(buyCoordinates) {
    if (buyCoordinates) {
        // Assuming `map` is already initialized
        var buyMarker = L.marker([buyCoordinates.lat, buyCoordinates.lon]).addTo(map);
        
        // Add a popup with the label "Buy"
        buyMarker.bindPopup("<b>Buy</b>").openPopup();
    }
}

// Function to display the total cost in the UI
function displayTotalCost(totalCost) {
    const totalCostElement = document.getElementById('total-cost-display');
    totalCostElement.textContent = `Total Cost: ${totalCost} PHP`;
}

// Event listener for the Check button
document.getElementById('checkBuyLocationButton').addEventListener('click', function() {
    const deliveryInfo = getsaveDeliveryDetails();
    if (deliveryInfo) {
        // Display the buy location on the map
        showBuyLocation(deliveryInfo.buyCoordinates);
        
        // Display the total cost in the UI
        displayTotalCost(deliveryInfo.totalCost);
    }
});

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

// Example call to the function
const deliveryInfo = getsaveDeliveryDetails();
if (deliveryInfo) {
    console.log("Delivery Info:", deliveryInfo);
}
