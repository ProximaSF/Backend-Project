console.log("homepage.js loaded")

// use getElementById for id
// use querySelector for class
const login_button = document.getElementById("login");
const signup_button = document.getElementById("signup")


// Detect login button press
login_button.addEventListener("click", function() {
    window.location.href = "/login" // navigate to the logout route handler
    /* 
    This creates an HTTP GET request to your server for that path
    The Express server receives this request and matches it to the app.get("/login", ...) route handler
    The route handler executes its code in it
    */

});


// Detect signup button press
signup_button.addEventListener("click", function() {
    window.location.href = "/signup" // navigate to the signup route handler
});