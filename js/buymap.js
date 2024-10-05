let marker; // Marker for the map
let lastClickedCoordinates = null; // Store last clicked coordinates

// Initialize the map and set its view to General Santos City
const map = L.map('map', { zoomControl: false }).setView([6.1164, 125.1716], 13);

// Load OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Search for location using Nominatim API
function searchLocation() {
    const location = document.getElementById('location-search').value.trim();
    if (!location) return alert("Please enter a location to search");

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                map.setView([lat, lon], 13);
            } else {
                alert("Location not found");
            }
        })
        .catch(() => alert("Error searching for location"));
}

// Get suggestions for location input
function getSuggestions() {
    const input = document.getElementById('location-search').value.trim();

    if (input.length > 2) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${input}&limit=5`)
            .then(response => response.json())
            .then(data => {
                const suggestionsBox = document.getElementById('suggestions');
                suggestionsBox.innerHTML = ''; // Clear previous suggestions

                if (data.length > 0) {
                    data.forEach(location => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.className = 'suggestion-item'; // Add custom styling class
                        suggestionItem.innerText = location.display_name;
                        suggestionItem.onclick = () => selectSuggestion(location);
                        suggestionsBox.appendChild(suggestionItem);
                    });
                    suggestionsBox.style.display = 'block'; // Show suggestions
                } else {
                    suggestionsBox.innerHTML = '<div>No results found</div>';
                }
            })
            .catch(() => console.error("Error fetching suggestions"));
    } else {
        document.getElementById('suggestions').style.display = 'none'; // Hide suggestions
    }
}

// Select a location from suggestions
function selectSuggestion(location) {
    document.getElementById('location-search').value = location.display_name;
    document.getElementById('suggestions').style.display = 'none'; // Hide suggestions
    map.setView([location.lat, location.lon], 13);
}

// Add a marker on map click
map.on('click', e => {
    const { lat, lng } = e.latlng;

    // Remove existing marker
    if (marker) map.removeLayer(marker);

    // Add new marker
    marker = L.marker([lat, lng]).addTo(map);
    lastClickedCoordinates = { lat, lon: lng };

    getAddress(lat, lng); // Fetch address with reverse geocoding
});

// Get address from coordinates
function getAddress(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            const address = data.display_name;
            document.getElementById('address').innerText = address; // Update address
            openCard(); // Slide up the card
        })
        .catch(() => alert("Error fetching address"));
}

// Open sliding card
function openCard() {
    document.getElementById('address-card').classList.add('open');
}

// Close sliding card
function closeCard() {
    document.getElementById('address-card').classList.remove('open');
}

// Track user location
function trackLocation() {
    map.locate({ setView: true, maxZoom: 16 });

    map.on('locationfound', e => {
        const { lat, lng } = e.latlng;
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();
    });

    map.on('locationerror', () => alert("Unable to access your location"));
}

// Confirm details and redirect to index.html
function confirmedBuyDetails() {
    if (!lastClickedCoordinates) return alert("No location selected. Please click on the map first.");

    const address = document.getElementById('address').innerText;
    const params = new URLSearchParams({
        address,
        lat: lastClickedCoordinates.lat,
        lng: lastClickedCoordinates.lon
    });

    localStorage.setItem('buyCoordinates', JSON.stringify(lastClickedCoordinates));
    closeCard(); // Optionally close card
    window.location.href = "index.html?address=" + encodeURIComponent(buyAddress) + "&deliveryAddress=" + encodeURIComponent(deliveryAddress);
}
