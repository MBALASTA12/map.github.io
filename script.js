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
    
    // Function to update the marker position
    function updateMarker() {
        let currentCenter = centerMarker.getLatLng();
        let newCenter = map.getCenter();

        // Check if the center has changed
        if (!currentCenter.equals(newCenter)) {
            centerMarker.setLatLng(newCenter); // Update the marker to the center of the map
        }
    }

    // Add move event listener to the map for desktop and mobile
    map.on('move', updateMarker);
    map.on('touchmove', updateMarker); // For mobile touch events

    // Function to get the address using reverse geocoding
    function getAddress(latlng) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.display_name) {
                    centerMarker.bindPopup(data.display_name).openPopup(); // Show address in popup
                }
            })
            .catch(error => console.error("Error fetching address:", error));
    }

    // Variable to control fetching
    let moveEndTimeout;

    // Add end event listener to the map to fetch the address
    map.on('moveend', () => {
        clearTimeout(moveEndTimeout); // Clear any existing timeout
        moveEndTimeout = setTimeout(() => {
            const latlng = map.getCenter();
            getAddress(latlng); // Get address after user stops moving
        }, 1000); // 1-second delay to prevent multiple calls
    });
});
