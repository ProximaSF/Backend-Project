console.log("Userpage.js loaded")


const logout_button = document.getElementById("logout")

logout_button.addEventListener("click", function() {
    console.log("logout was clicked")

    // since httpOnly is true, can not delete cookie vias client side, must from server-side
    window.location.href = "/logout" //change url path to .com/logout
});