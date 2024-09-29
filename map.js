// map.js

let marker; // Variable to hold the marker

// Initialize the map and set its view to General Santos City
const map = L.map('map', {
    zoomControl: false
}).setView([6.1164, 125.1716], 13);

// Load and display the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to search for a location using Nominatim API
function searchLocation() {
    const location = document.getElementById('location-search').value;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                map.setView([lat, lon], 13);
            } else {
                alert("Location not found");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error searching for location");
        });
}

// Function to get location suggestions using Nominatim API
function getSuggestions() {
    const input = document.getElementById('location-search').value;

    // Only fetch suggestions if input length is > 2
    if (input.length > 2) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${input}&limit=5`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const suggestionsBox = document.getElementById('suggestions');
                suggestionsBox.innerHTML = ''; // Clear previous suggestions
                suggestionsBox.style.display = 'block'; // Show suggestions box

                if (data.length > 0) {
                    data.forEach(location => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.innerText = location.display_name;
                        suggestionItem.onclick = () => selectSuggestion(location);
                        suggestionsBox.appendChild(suggestionItem);
                    });
                } else {
                    suggestionsBox.innerHTML = '<div>No results found</div>';
                }
            })
            .catch(err => {
                console.error(err);
            });
    } else {
        document.getElementById('suggestions').style.display = 'none'; // Hide suggestions if input is too short
    }
}

// Function to handle suggestion selection
function selectSuggestion(location) {
    const suggestionsBox = document.getElementById('suggestions');
    suggestionsBox.style.display = 'none'; // Hide the suggestions box

    // Set the selected location in the input field
    document.getElementById('location-search').value = location.display_name;

    // Move the map to the selected location
    map.setView([location.lat, location.lon], 13);
}

// Function to add a marker when the user clicks the map
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    // Remove existing marker if any
    if (marker) {
        map.removeLayer(marker);
    }

    // Add a new marker at the clicked location
    marker = L.marker([lat, lon]).addTo(map);

    // Optionally, you can fetch the address of the clicked location using reverse geocoding
    getAddress(lat, lon);
});

// Reverse geocoding to get the address of the clicked location
function getAddress(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name;
            alert(`You clicked on: ${address}`); // Show the address in an alert (You can display it elsewhere if needed)
        })
        .catch(err => {
            console.error(err);
            alert("Error fetching address");
        });
}

// GPS tracking function
function trackLocation() {
    map.locate({ setView: true, maxZoom: 16 });

    map.on('locationfound', function(e) {
        const userLat = e.latlng.lat;
        const userLon = e.latlng.lng;

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([userLat, userLon]).addTo(map)
            .bindPopup("You are here").openPopup();
    });

    map.on('locationerror', function() {
        alert("Unable to access your location");
    });
}
