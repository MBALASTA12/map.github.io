// Function to load both buy and delivery addresses from localStorage
function loadAddresses() {
    // Get the stored buy address and delivery address from localStorage
    const buyAddress = localStorage.getItem('buyAddress');
    const deliveryAddress = localStorage.getItem('deliveryAddress');

    // Replace the "Where to Buy" text if a buy address is found
    if (buyAddress) {
        const buyLink = document.getElementById('buyLink');
        buyLink.textContent = `Buy Address: ${buyAddress}`;
    }

    // Replace the "Where to Deliver" text if a delivery address is found
    if (deliveryAddress) {
        const deliverLink = document.getElementById('deliveryLink');
        deliverLink.textContent = `Deliver Address: ${deliveryAddress}`;
    }
}

// Call the function to load the addresses when the page loads
window.onload = loadAddresses;
