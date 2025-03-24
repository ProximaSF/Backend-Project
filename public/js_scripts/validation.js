console.log("validation.js loaded")


document.addEventListener("DOMContentLoaded", function() {
  // Check if there are server errors and display them
  const serverErrorsContainer = document.querySelector(".server-errors");
  if (serverErrorsContainer && serverErrorsContainer.querySelectorAll("p").length > 0) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerText = Array.from(serverErrorsContainer.querySelectorAll("p"))
      .map(p => p.textContent)
      .join(". ");
  }
});

// gets all form elements in document and stores them in a NodeList called forms
const form = document.querySelectorAll("form")

// Add event listener to each form
// For each form in the forms collection, do the following...
form.forEach(form => {
    form.addEventListener("submit", async (e) => {      
        
        e.preventDefault();
        const username_input = form.querySelector("input[placeholder='Username']");

        if(username_input){
            // For signup
            const email_input = document.getElementById("signup-email-input");
            const password_input = document.getElementById("signup-password-input");
            const repeat_password_input = form.querySelector("input[placeholder='Repeat Password']");
            const checkbox = form.querySelector("input[type='checkbox']");

            const error_message = form.parentElement.querySelector("#error-message");

            let errors = getSignupFormErros(username_input.value, email_input.value, password_input.value, repeat_password_input.value, checkbox.checked)
            if (errors.length > 0){
                error_message.innerText = errors.join(". ")

                // Color input border red if input is empty
                const allInput = [username_input, email_input, password_input, repeat_password_input].filter(input => input != null)
                allInput.forEach(input => {
                    input.addEventListener("input", () => {
                        if(input.parentElement.classList.contains("incorrect")){
                            input.parentElement.classList.remove("incorrect")
                        }
                    })
                })
                console.log("Input Error for Signup")
            }
            else{
                // If no client-side errors, submit the form to server for server validation check
                form.submit();
            }
        }

// ------------------------------------------------------------------------------------------
        else{
            // For login
            const email_input = form.querySelector("input[placeholder='Email']");
            const password_input = form.querySelector("input[placeholder='Password']");
            const error_message = form.parentElement.querySelector("#error-message");

            let errors = getLoginFormErros(email_input.value, password_input.value)
            if (errors.length > 0){
                error_message.innerText = errors.join(". ")
                
                // Color input border red if input is empty
                const allInput = [email_input, password_input].filter(input => input != null)
                allInput.forEach(input => {
                    input.addEventListener("input", () => {
                        if(input.parentElement.classList.contains("incorrect")){
                            input.parentElement.classList.remove("incorrect")
                        }
                    })
                })
                console.log("Input errors")
            }
            // Check all filled entries
            else{
                // If no client-side errors, submit the form to server for server validation check
                form.submit();
                //error_message.innerText = "Email or password do not match"
            }
        }
    })
});



function getSignupFormErros(username, email, password, repeat_password, isTermChecked){
    let errors = []

    const username_input = document.querySelector("input[placeholder='Username']");
    const email_input = document.getElementById("signup-email-input");
    const password_input = document.getElementById("signup-password-input");
    const repeat_password_input = document.querySelector("input[placeholder='Repeat Password']");

    if (username === '' || username == null){
        errors.push("Username is required")
        username_input.parentElement.classList.add("incorrect")
    }
    else if (username_input.value.length <= 3 || username_input.value.length >= 10){
        errors.push("Username must have characters between 4-10")
        username_input.parentElement.classList.add("incorrect")

    }
    //--------------
    if (email === '' || email == null){
        errors.push("Email is required")
        email_input.parentElement.classList.add("incorrect")
    }
    //--------------
    if (password === '' || password == null){
        errors.push("Password is required")
        password_input.parentElement.classList.add("incorrect")
    }
    else if (password_input.value.length <= 4 || !password_input.value.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{5,}$/)){
        errors.push("Password must be more than 5 characters long and must contain uppercase(S), number(s) and a special character")
        password_input.parentElement.classList.add("incorrect")
    }
    //--------------
    if (repeat_password === '' || repeat_password == null){
        errors.push("Repeat password is required")
        repeat_password_input.parentElement.classList.add("incorrect")
    }
    else if (password_input.value != repeat_password_input.value){
        errors.push("Repeat password do not match")
        repeat_password_input.parentElement.classList.add("incorrect")
    }
    //--------------
    if (!isTermChecked){
        errors.push("Must agree to Term of Condition")
    }
    return errors
}

function getLoginFormErros(email, password){
    let errors = []
    const email_input = document.querySelector("input[placeholder='Email']");
    const password_input = document.querySelector("input[placeholder='Password']");

    if (email === '' || email == null){
        errors.push("Email is required")
        email_input.parentElement.classList.add("incorrect")
    }
    if (password === '' || password == null){
        errors.push("Password is required")
        password_input.parentElement.classList.add("incorrect")
    }
    return errors
}