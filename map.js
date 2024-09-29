// map.js
// Initialize the map and set its view to General Santos City
const map = L.map('map', {
    zoomControl: false
}).setView([6.1164, 125.1716], 13);

// Load and display the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Search location function using Nominatim API
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
