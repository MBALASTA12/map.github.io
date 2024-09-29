// script.js
document.addEventListener("DOMContentLoaded", function() {
    console.log("Welcome to My Web App!");
});

    // Function to load the delivery address from localStorage
    function loadAddress() {
        // Get the stored address from localStorage
        const address = localStorage.getItem('deliveryAddress');
        
        // If an address is found, replace the "Where to Buy" text
        if (address) {
            const deliveryLink = document.querySelector('.buy-link');
            deliveryLink.textContent = `Delivery Address: ${address}`;
        }
    }

    // Call the function to load the address when the page loads
    window.onload = loadAddress;
