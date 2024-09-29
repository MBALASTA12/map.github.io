// Initialize the map
        const map = L.map('map').setView([6.12108, 125.15882], 13);

        // Add tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Function to fetch address details using reverse geocoding
        async function fetchAddress(lat, lon) {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            return data.display_name || 'Unknown address';
        }

        // Function to update the pickup card and slide it up
        function updatePickupCard(lat, lon, address) {
            document.getElementById('pickup-address').textContent = `Address: ${address}`;
            document.getElementById('pickup-coordinates').textContent = `Coordinates: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
            slideUpPickupCard();
        }

        // Function to slide up the pickup card
        function slideUpPickupCard() {
            const pickupCard = document.getElementById('pickup-card');
            pickupCard.classList.add('visible'); // Slide up and show the card
        }

        // Handle map click event to get location and show pickup card
        map.on('click', async function(e) {
            const lat = e.latlng.lat;
            const lon = e.latlng.lng;
            const address = await fetchAddress(lat, lon); // Fetch the address using reverse geocoding
            updatePickupCard(lat, lon, address); // Update the pickup card
        });
