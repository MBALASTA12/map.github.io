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

// Call the function to start updating the driver's location
updateDriverLocation();
