const validations = require("./public/js_scripts/login_signup_validaiton.js")

const express = require("express")

const database = require("better-sqlite3")("UserDB.db") // create database
database.pragma("journal_mode = WAL") //Write-Ahead Logging (WAL) journal mode - improve performance

// bd setup
const createTable = database.transaction(() => {
    database.prepare(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username STRING NOT NULL UNIQUE,
        email STRING NOT NULL UNIQUE,
        password STRING NOT NULL)
        `).run()
})
createTable()

// Delete all rows from database
function reset_db(){
    const deleteAllUsers = database.prepare("DELETE FROM users");
    deleteAllUsers.run();
}
// reset_db()


createTable()
const app = express()

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: false})) // allow the access of value in app.post() by user
app.use(express.static("public")) //Acces the public folder


//Middleware 
app.use(function (req, res, next) {
    res.locals.errors = []
    next()
}) 

app.get("/homepage", (req, res) => { //request and response
    res.render("homepage")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/userPage", (req, res) => {
    res.render("userPage")
})


validations.signup_validation(app, database)
validations.login_validation(app, database)

app.listen(3000) // tell to listen on port 3000
// Go to localhost:3000/homepage in the webbrowser to vist the site

//Will need to reload node up update changes
