console.log("Userpage.js loaded")

const homepage_button = document.getElementById("homepage")
const logout_button = document.getElementById("logout")

homepage_button.addEventListener("click", function() {
    console.log("Homepage button was pressed");
        
    window.location.href = "/homepage/true"

})

logout_button.addEventListener("click", function() {
    console.log("logout was clicked")

    // since httpOnly is true, can not delete cookie vias client side, must from server-side
    window.location.href = "/logout" //change url path to .com/logout
});