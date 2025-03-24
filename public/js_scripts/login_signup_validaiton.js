// Get user input values
const bcrypt = require("bcrypt"); // Usd to encrypt (password)

function signup_validation(app, database){
    app.post("/signup", (req, res) => { // "/signup" must match the action attribute name in the html form tag 
        const errors = []

        // Signup validation
        const username = typeof req.body.username === "string" ? req.body.username : ""; // condition ? valueIfTrue : valueIfFalse
        const email = typeof req.body.email === "string" ? req.body.email : "";
        const password = typeof req.body.password === "string" ? req.body.password : "";
        const repeat_password = typeof req.body.repeat_password === "string" ? req.body.repeat_password : "";

        console.log(`
            Username ${username}
            Email: ${email}
            Password: ${password}
            Repeat Password: ${repeat_password}`)

        if (!username) {
            errors.push("Username is required");
        } else if (username.length <= 3 || username.length > 10) {
            errors.push("Username must have characters between 4-10");
        } else if (!username.match(/^[a-zA-Z0-9]+$/)) {
            errors.push("Username can only contain letters and numbers");
        }

        if (!email) {
            errors.push("email is required")
        }

        if (!password || password.length <= 4 || !password.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{5,}$/)) {
                errors.push("Password must be more than 5 characters long and must contain uppercase(S), number(s) and a special character");
        }
        if (!repeat_password || password != repeat_password) {
            errors.push("Repeat password do not match or is missing");
        }

        if (errors.length){
            return res.render("signup", { // the return will reload the page with the updated error msg
                errors,        // Need to add add div in the ejs to display the errorr (last div server.ejs)
                username,    //add the value attribute in the input tag to store user input after submission when there's an error
                email,
                password,
                repeat_password
            })
        }
        // save user data in database
        const salt = bcrypt.genSaltSync(10)
        req.body.password = bcrypt.hashSync(req.body.password, salt)

        const getUsers = database.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)") // ? is the driver (better-sqlite3) to handle/prepare a sql statement
        getUsers.run(req.body.username, req.body.email, req.body.password)
        
        // Log the user and direct to user home page
        res.render("UserPage", {
            username: username // used to display username in UserPage page
        })
    })
}


function login_validation(app, database){
    app.post("/login", (req, res) => { // "/login" must match the action attribute name in the html form tag 
        const errors = []

        // login validation
        const email = typeof req.body.email === "string" ? req.body.email : "";
        const input_password = typeof req.body.password === "string" ? req.body.password : "";


        console.log(`
            Email: ${email}
            Password: ${input_password}
        `)


        function getUserByColumn(columnName, value){
            const query = database.prepare(`SELECT * FROM users WHERE ${columnName} =?`)
            // console.log(query) //db infos
            const result = query.get(value);
            return result; // A dict of all the column names and their values
        }

        const user = getUserByColumn('email', email);
        console.log(user)

        if (!email) {
            errors.push("email is required")
        }
        else if(!user){
            errors.push("Email do not exist")
        }


        if (!input_password ) {
                errors.push("Password is required");
        }
        else if (user && !bcrypt.compareSync(input_password, user.password)) {
            errors.push("Incorrect password");        
        }
        
        if (errors.length){
            return res.render("login", { // the return will reload the page with the updated error msg
                errors, // Need to add add div in the ejs to display the errorr (last div login.ejs)
                email
            })
        }
        else {
            res.render("UserPage", {
                // Display username in userPage 
                username: user.username, // row.column_name
            })
        }
    })
}

module.exports = {
    signup_validation,
    login_validation
};