console.log("server validation.js loaded")

// Get user input values

const bcrypt = require("bcrypt"); // Usd to encrypt (password)
const jwt = require("jsonwebtoken")
require('dotenv').config()

console.log("Server validation npm stuff loaded")


async function signup_validation(app, database){
    app.post("/signup", async (req, res) => { // "/signup" must match the action attribute name in the html form tag 
        const errors = []

        // Signup validation input variables stored
        const username = typeof req.body.username === "string" ? req.body.username : ""; // condition ? valueIfTrue : valueIfFalse
        const email = typeof req.body.email === "string" ? req.body.email : "";
        const password = typeof req.body.password === "string" ? req.body.password : "";
        const repeat_password = typeof req.body.repeat_password === "string" ? req.body.repeat_password : "";

        console.log(`
            Username ${username}
            Email: ${email}
            Password: ${password}
            Repeat Password: ${repeat_password}`)

        async function checkValueExist(columnName, value){
            const [result] = await database.query(`
                SELECT * FROM users 
                WHERE ?? = ?`, [columnName, value])
            return !!result[0] // Convert to boolean (true if exists, false if not)
        }
        
        if (!username) {
            errors.push("Username is required");
        } else if (username.length <= 3 || username.length > 10) {
            errors.push("Username must have characters between 4-10");
        } else if (!username.match(/^[a-zA-Z0-9]+$/)) {
            errors.push("Username can only contain letters and numbers");
        } else if (await checkValueExist("username", username)) {
            errors.push("Username already exist")
        }

        if (!email) {
            errors.push("email is required")
        } else if (await checkValueExist("email", email) ) {
            errors.push("Email being used")
        }

        if (!password || password.length <= 4 || !password.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{5,}$/)) {
                errors.push("Password must be more than 5 characters long and must contain uppercase(S), number(s) and a special character");
        }
        if (!repeat_password || password != repeat_password) {
            errors.push("Repeat password do not match or is missing");
        }

        if (errors.length){
            return res.render("signup", { // the return will reload the page with the updated error msg
                errors,        // Need to add div in the ejs to display the error (last div tag in server.ejs)
                username,    //add the value attribute in the input tag to store user input after submission when there's an error
                email,
                password,
                repeat_password
            })
        }
        // save user data in database
        const salt = bcrypt.genSaltSync(10) //encrypt password
        req.body.password = bcrypt.hashSync(req.body.password, salt) //password is now encrypted

        database.query(`
            INSERT 
                INTO users (username, email, password) 
            VALUES 
                (?, ?, ?)`, [req.body.username, req.body.email, req.body.password])
        
        const [userData] = await database.query(`
            SELECT * FROM users 
            WHERE email = ?`, [req.body.email])

        const user = userData[0] // Get user info row

        // Create JWT token
        const TokenValue = jwt.sign({exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, userid: user.id, username: user.username, email: user.email}, process.env.JWT_SECRET)
        
        // Set the cookie
        res.cookie("SimpleValidationApp", TokenValue, {
            httpOnly: true, // if true, prevent cookie from deleting from clietn side to prevent XSS attacks
            secure: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24
        })

        // Log the user and direct to user home page if no error
        res.render("UserPage", {
            username: username // used to display username in UserPage page
        })
    })
}


async function login_validation(app, database){ //async is for look up the database (promis involed)
    app.post("/login", async (req, res) => { // "/login" must match the action attribute name in the html form tag 
        const errors = []

        // login validation in value stored
        const email = typeof req.body.email === "string" ? req.body.email : "";
        const input_password = typeof req.body.password === "string" ? req.body.password : "";


        console.log(`
            Email: ${email}
            Password: ${input_password}
        `)


        async function getUserByColumn(columnName, value){
            const [result] = await database.query(`
                SELECT * FROM users 
                WHERE ?? = ?`, [columnName, value])
            return result[0]; 
        }
        
        const user = await getUserByColumn('email', email);
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
        else if (user && user.password && !bcrypt.compareSync(input_password, user.password)) {
            errors.push("Email/password or both incorrect");        
        }
        
        if (errors.length){
            return res.render("login", { // the return will reload the page with the updated error msg
                errors, // Need to add add div in the ejs to display the errorr (last div login.ejs)
                email
            })
        }
        else {
            
            const TokenValue = jwt.sign({exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, userid: user.id, username: user.username, email: user.email}, process.env.JWT_SECRET)
            // Set the cookie
            res.cookie("SimpleValidationApp", TokenValue, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24
            })

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