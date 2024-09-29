document.addEventListener("DOMContentLoaded", function() {
    console.log("Welcome to My Web App!");

    // Initialize the map
    var map = L.map('map').setView([51.505, -0.09], 13); // Set initial view (latitude, longitude, zoom level)

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker (optional)
    var marker = L.marker([51.505, -0.09]).addTo(map);
    marker.bindPopup("<b>Hello!</b><br>This is a marker.").openPopup();
});
