const validations = require("./public/js_scripts/server_validaiton.js")
const express = require("express")

const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const cookieparser = require('cookie-parser')


require("dotenv").config() // Required so can grab the values from .env file


// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST, //Database host: "127.0.0.1"
    user: process.env.MYSQL_USER, //mySQL username: "root"
    password: process.env.MYSQL_PASSWORD, //mySQL password
    database: process.env.MYSQL_DATABASE // Database name, not table name
}).promise(); // Allow the use of promis api of mysql instead of call-back function


// Delete all rows from database
async function reset_db(){
    try {
        const conn = await pool.getConnection(); // is a promis obj but since inside async function, conn its a connection obj
        await conn.query("DELETE FROM users");
        conn.release();
        console.log("Database deleted")
    } catch (err) {
        console.error("Failed to reset database:", err)
    }
}
//reset_db()

const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false})) // allow the access of value in app.post() by user
app.use(express.static("public")) //Acces the public folder
app.use(cookieparser())



//Middleware 
app.use(function (req, res, next) {
    res.locals.errors = []

    // try to decode incoming cookies
    try {
        const decoded = jwt.verify(req.cookies.SimpleValidationApp, process.env.JWT_SECRET)
        req.user = decoded
    } catch(err) {
        req.user = false
    }

    // If token is valid: 
    // res.locals.user = req.user
    // console.log(req.user)
    /* Might return something like
    {
    exp: 1743474079,
    userid: 19,
    username: 'SllepyJoe',
    email: 'j@aol.com',
    iat: 1743387679
    }
    */
    next()
});

//---------------
// app.get() are routs
app.get("/homepage/:param?", (req, res) => { //request and response
    
    const param = req.params.param;

    if (param == "true") {
        if (req.user) {
            res.render("homepage", {
                message: `${req.user.username}, click login to enter your page`
            })
        }

    } else {
        if (req.user) {
            res.render("userPage", {
                username: req.user.username
            })
        } else {
            res.render("homepage", {
                message: ''
            }) // homepage or /homepag will both work
        }
    }
})

app.get("/login", (req, res) => {

    if (req.user) {
        res.render("userPage", {
            username: req.user.username
        })
    } else {
        res.render("login")
    }
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/userPage", (req, res) => {  
    res.render("userPage")
})

app.get("/logout", (req, res) => {
    res.clearCookie("SimpleValidationApp", {
        path: "/",
        httpOnly: true,
        secure: true
        // Include all cookie options that were set when creating it
    });

    res.render("homepage", {
        message: ''
    })
})



/*
pool.getConnection() returns a Promise that resolves when a connection to the MySQL 
database is successfully established.

.then() ensuring that the validation functions are only set up after the database 
connection is available.
*/

pool.getConnection().then(database => {
    validations.signup_validation(app, database)
    validations.login_validation(app, database)
})

app.listen(3000) // tell to listen on port 3000
// Go to localhost:3000/homepage in the webbrowser to vist the site

//Will need to reload node up update changes
