// Get the form
document.getElementById("contactForm").addEventListener("submit", function(event) {
    // Get form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();
    const errorMessage = document.getElementById("error-message");

    // Clear previous error messages
    errorMessage.textContent = "";

    //Check if all fields are filled
    if (!name || !email || !phone || !message) {
        errorMessage.textContent = "Please fill out all fields";
        event.preventDefault(); // Prevent form submission
        return; // Stops the code
    }

    // Check if the phone number is numeric and 9 or 10 digits long
    const phoneRegex = /^\d{9,10}$/;
    if (!phoneRegex.test(phone)) {
        errorMessage.textContent = "Please enter a valid phone number (9 or 10 digits).";
        event.preventDefault();
        return;
    }

    // Check if the name consists of text only (no numbers or special characters)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
        errorMessage.textContent = "Name must contain text only.";
        event.preventDefault();
        return;
    }

    alert("Message successfully sent!")
});

// Display Modal
console.log(localStorage.getItem("access_token"));
if(!localStorage.getItem("access_token")) {
    document.addEventListener("DOMContentLoaded", function () {
        const modal = document.getElementById("spotifyModal");
        const closeBtn = document.querySelector(".close-btn");
        const connectBtn = document.getElementById("connectSpotifyBtn");
    
        // Show modal after 2 seconds
        setTimeout(() => {
          modal.style.display = "flex";
        }, 2000);
      
        // Close modal on clicking close button
        closeBtn.addEventListener("click", () => {
          modal.style.display = "none";
        });
      
        // Close modal on clicking anywhere outside the modal content
        window.addEventListener("click", (event) => {
          if (event.target === modal) {
            modal.style.display = "none";
          }
        });
      
        // Add functionality to connect button
        connectBtn.addEventListener("click", () => {
          window.location.href = "/login"; // Replace with your Spotify login URL
        });
      });

}
  