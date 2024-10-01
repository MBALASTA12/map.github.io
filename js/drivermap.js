// Initialize map centered on General Santos City
var map = L.map('map', {
    zoomControl: false, // Remove zoom buttons
}).setView([6.1164, 125.1716], 13); // Coordinates of General Santos City

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a custom arrow icon for the driver's location
var driverIcon = L.icon({
    iconUrl: 'icon/arrow-icon.svg', // Path to your arrow icon
    iconSize: [30, 30], // Size of the icon
    iconAnchor: [15, 15], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -15] // Point from which the popup should open relative to the iconAnchor
});

// Create a marker for the driver's location with the custom icon
var driverMarker = L.marker([6.1164, 125.1716], { icon: driverIcon }).addTo(map); // Initial position

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

// Function to update the direction based on device orientation
function updateDirection(event) {
    var alpha = event.alpha; // Compass direction (in degrees)

    // Set the rotation of the driver marker's icon
    driverMarker.getElement().style.transform = 'rotate(' + alpha + 'deg)';
}

// Event listener for device orientation
window.addEventListener('deviceorientation', updateDirection);

// Call the function to start updating the driver's location
updateDriverLocation();
