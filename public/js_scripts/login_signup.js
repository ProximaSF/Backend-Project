// Go to homepage when x pressed
const close_button = document.querySelectorAll(".close_popup")

close_button.forEach(go_homepage => {
    go_homepage.addEventListener("click", function(){
        window.location.href = "./homepage"
    });
})

// Switch between forms
const form_switch = document.querySelectorAll(".signup_login")
form_switch.forEach(switch_form => {
    switch_form.addEventListener("click", function(){
        if (switch_form.id == "to-signup"){ // check class by id match
            window.location.href = "./signup"
        }
        else{
            window.location.href = "./login"
        }
    })
})