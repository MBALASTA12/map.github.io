document.addEventListener("DOMContentLoaded", function() {
    console.log("Welcome to My Web App!");

    // Initialize the map
    var map = L.map('map').setView([51.505, -0.09], 13); // Set initial view (latitude, longitude, zoom level)

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to add a marker at the clicked location
    function addMarker(e) {
        var marker = L.marker(e.latlng).addTo(map); // Create a marker at the clicked location
        marker.bindPopup("<b>Marker!</b><br>Coordinates: " + e.latlng.toString()).openPopup(); // Optional: Bind a popup with coordinates
    }

    // Add click event listener to the map
    map.on('click', addMarker);
});
