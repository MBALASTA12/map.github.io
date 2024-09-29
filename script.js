document.addEventListener("DOMContentLoaded", function() {
    console.log("Welcome to My Web App!");

    // Initialize the map and set the initial view to General Santos City
    var map = L.map('map').setView([6.1026, 125.1716], 13); // General Santos City coordinates

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
