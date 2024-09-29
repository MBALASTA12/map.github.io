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
        centerMarker.setLatLng(map.getCenter()); // Set the marker to the center of the map
    }

    // Add move event listener to the map
    map.on('move', updateMarker);

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

    // Variable to track if we are already fetching the address
    let fetchingAddress = false;

    // Add end event listener to the map to fetch the address
    map.on('moveend', () => {
        if (!fetchingAddress) { // Check if we are not already fetching the address
            fetchingAddress = true; // Set the flag to true
            const latlng = map.getCenter();
            getAddress(latlng); // Get address after user stops moving
            setTimeout(() => {
                fetchingAddress = false; // Reset the flag after a delay
            }, 1000); // Delay to prevent multiple calls in quick succession
        }
    });
});
