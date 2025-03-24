# Backend Development Notes

## Node.js Basics

1. **npm** = Node Package Manager - used to install and manage JavaScript packages
2. Running a server
   - Basic method: `node server.js` in the terminal
   - Access the site by navigating to `localhost:3000` in a web browser
3. Nodemon \- automatically restarts the server when files change:
   - Add `"dev": "nodemon server"` in the `scripts` section of `package.json`
   - Run with `npm run dev` instead of `node server.js`

## Template Engines

1. Template engines

    allow using dynamic HTML templates instead of hardcoding HTML in server.js:

   - **EJS** (Embedded JavaScript) is a popular template engine
   - Create a folder called `views` to store EJS templates
   - Use `res.render("homepage")` to render templates (the .ejs extension is optional)
   - EJS templates are essentially HTML files with special tags for dynamic content

## File Organization (Why use different folders)

**Views folder** is for dynamic template files that get rendered on the server:

- Contains EJS, Pug, Handlebars, or other template files
- Templates are processed on the server with data injected into them
- Good for content that changes based on data, user state, etc.
- Not directly accessible to users through URLs

**Public folder** is for static assets and are served from the `public` folder:

- Set up with `app.use(express.static("public"))` in server.js
- Express will look for files in the public folder and serve them directly
- Contains CSS, JavaScript, images, and sometimes static HTML
- Served exactly as-is without processing
- Good for unchanging resources like stylesheets, client-side scripts, etc.
- Directly accessible through URLs

### Client-side vs. server-side validation

- **Client-side validation** (`validation.js` in the `js_scripts` folder) improves user experience
- **Server-side validation** is essential for security (client-side can be bypassed)
- Implement both for best user experience and security
- This project, client-side validation will first be performed. If no error is detected, than server-side validation will be active. If that passes also, than the user can login or have their registration data stored. 

## Form Handling

1. Processing form submissions server side

   - Add the `action` and `method` attributes to your form: `<form action="/register" method="post">`

   - Make sure each input tag has a `name` attribute

   - Add `app.use(express.urlencoded({extended: false}))` in `server.js` to parse form data

   - Access form data with `req.body.name` in your route handler:

     - `name` is the name attribute value inside the input tag
     - **Note**: For attribute names with spaces (e.g., `name="repeat password"`), Express replaces spaces with underscores in the request body. So, a field named "repeat password" will be accessible as `req.body.repeat_passwor`
       - Best practice to add a underscore instead of a space for names

     ```javascript
     app.post("/register", (req, res) => {
         console.log(req.body)
         res.send("Form has been submitted, thank you.")
     })
     ```

### Middleware in Express

1. Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application's request-response cycle:
   - Middleware runs between receiving a request and sending a response
   - Each middleware function can modify the request and response objects
   - Middleware must either end the request-response cycle or call the `next()` function

**Common uses for middleware**:

- Parsing request bodies (like `express.urlencoded`)
- Setting default values for templates
- Logging requests
- Authentication and authorization
- Error handling

**Example middleware**:

```javascript
app.use(function (req, res, next) {
    res.locals.errors = []
    next()
})
```

This middleware:

- Runs on every request to the application
- Initializes `res.locals.errors` as an empty array
- Makes `errors` available to all templates rendered during the request
- Prevents template errors when checking for `errors.length` if no errors were explicitly passed
- Calls `next()` to pass control to the next middleware function

### Embedded JavaScript (EJS) Syntax

All EJS syntax is processed on the server before sending the response to the client. The client only sees the final HTML output, not the EJS code.

1. `<% %>` - Executes JavaScript code without outputting anything (for logic, loops, etc.)
2. `<%= %>` - Outputs a JavaScript expression (HTML-escaped to prevent XSS attacks)
3. `<%- %>` - Outputs a JavaScript expression without HTML escaping (use with caution)
4. `<%# %>` - Comments that won't appear in the rendered HTML

**Example**:

```ejs
<% if(typeof errors != 'undefined'){ %>
  <div class="server-errors">
    <% errors.forEach(function(error){ %>
      <p><%= error %></p>
    <% }) %>
  </div>
<% } %>
```

- `<% if(typeof errors != 'undefined'){ %>` - Checks if the `errors` variable exists
- `<% errors.forEach(function(error){ %>` - Loops through each error in the errors array
- `<%= error %>` - Outputs the error message text inside a paragraph element
- `<% }) %>` - Closes the forEach loop
- `<% } %>` - Closes the if statement

### Preserving Form Input After Validation Errors

To preserve user input after form submission fails:

- Pass the form data back to the template when rendering with errors
  - Add a `value` attribute to the input elements using EJS:

```html
<input type="text" name="username" placeholder="Username" id="username-input" value="<%= typeof username != 'undefined' ? username : '' %>">
```



## Using SQLite (better-sqlite3)

1. Install `npm install better-sqlite3`

2. Automatically create a database using:

   ```js
   const database = require("better-sqlite3")("UserDB.db")
   ```

   - This creates or opens a SQLite database file named "UserDB.db" in the current working directory
   - It loads the better-sqlite3 module and immediately initializes a database connection

3. Than add `WAL `under the `database `variable to improve performance:

   ```js
   db.pragma("jorunal_mode = WAL")
   ```

   - WAL (Write-Ahead Logging) is a journal mode that improves concurrency (multiple operations or processes happening at the same time) and performance. 

   - In standard SQLite mode, the database is locked during writes, preventing other processes from reading. With WAL mode:

     - Multiple processes can read from the database while one process is writing
     - Transactions are generally faster
     - The database is more resilient to crashes or power failures

     - It's better for applications where read performance is important


#### SQLite Info

`prepare()` - Creates a prepared statement

`get()` - Retrieves a single row as an object

`all()` - Retrieves all rows as an array of objects

1. Use `database.transaction()` to create a table of columns which will be used to store the values for each row:

   ```js
   const createTable = database.transaction(() => {
       database.prepare(`
           CREATE TABLE IF NOT EXISTS users (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           username STRING NOT NULL UNIQUE,
           email STRING NOT NULL UNIQUE,
           password STRING NOT NULL)
           `).run()
   })
   ```

   - After the server-side validation is passed, store the new user login information into database using `prepare` than `run`:

     ```js
     const getUsers = database.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)") // ? is the driver (better-sqlite3) to handle/prepare a sql statement
         getUsers.run(req.body.username, req.body.email, req.body.password)
     ```

## Encrypting Database Password

1. Use bcrypt to encrypt string: `npm install bcrypt`

2. Add the package in to the serve

   ```js
   const bcrypt = require("bcrypt")
   ```

3. Encrypt user input password after successfully regstration with `genSaltSync` and `hashSync`

   ```js
   const salt = bcrypt.genSaltSync(10)
   req.body.password = bcrypt.hashSync(req.body.password, salt)
   ```

4. Use the new `req.body.password` to be stored in the database which should be encrypted. 

5. To compare encrypted and decrypted password, use `compareSync` method

   ```js
   bcrypt.compareSync(decrypted, encrypted)
   ```

   - Use to see if user entered the correct password.
