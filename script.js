document.addEventListener("DOMContentLoaded", function() {
    console.log("Welcome to My Web App!");

    // Initialize the map and set the initial view to General Santos City
    var map = L.map('map').setView([6.1026, 125.1716], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create a marker for the center
    var centerMarker = L.marker(map.getCenter(), { draggable: false }).addTo(map);

    // Function to get the address using reverse geocoding
    function getAddress(latlng) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.display_name) {
                    // Show address in popup at the clicked location
                    L.popup()
                        .setLatLng(latlng)
                        .setContent(data.display_name)
                        .openOn(map);
                }
            })
            .catch(error => console.error("Error fetching address:", error));
    }

    // Add a click event listener to show address details
    map.on('click', function(e) {
        getAddress(e.latlng); // Fetch and display the address for the clicked location
    });

    // Update the marker position on map movement
    map.on('move', function() {
        let newCenter = map.getCenter();
        centerMarker.setLatLng(newCenter); // Update the marker to the center of the map
    });
});
