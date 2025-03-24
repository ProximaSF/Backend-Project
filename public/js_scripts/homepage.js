console.log("homepage.js loaded")

// use getElementById for id
// use querySelector for class
const login_button = document.getElementById("login");
const signup_button = document.getElementById("signup")


// Detect login button press
login_button.addEventListener("click", function() {
    window.location.href = "./login"
});


// Detect signup button press
signup_button.addEventListener("click", function() {
    window.location.href = "./signup"
});