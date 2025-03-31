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
- Check for cookie

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

<u>Note: Switched to MySQL:</u>

- SQLite is local file-based
- MySQL is server-based (more for AWS hosting)

<hr>

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

<hr>

## MySQL2

1. `npm install mysql2`

2. MySQL requires connection parameters (host, user, password)

    ```js
    const mysql = require("mysql2/promis")
    
    // Create connection
    const pool = mysql.creatpool({
        host: "localhost", //Database host
        user: "root", //MySQL username
        password: "Honky@1", //MySQL password
        database: "UserDB", //Database file name not table name
        ...
    })
    ```

    - Should use `.env` instead of hardcoding the database values inside the creatpool parameter. 

3. MySQL operations are <u>asynchronous</u>, requiring async/await

   1. promises need to be awaited so it can grab and return data

   ```js
   async function createTable(){
       try{
           const conn = await pool.getConnection();
           await conn.query(`
           ...
           `);
           conn.release();
           console.log("Table created");
       } catch {
           console.error("Error creating table: ", err)
       }
   }
   ```

4. SQL injection attack

### When to use `async` & await

- Add `async` before any function that uses `await` inside it
- Usually function that returns a Promise should be declared with `async`
- Use `await` whenever you call a function that returns a Promise and you need its result

#### Common Promise-returning functions include:

- Database queries
- API calls
- File operations
- Any function declared with `async`

1. If a function talks to something external (database, API, file system), it probably needs `async`

2. If you call an `async` function and need its actual result (not just the Promise), you need `await` when calling the function

3. You can only use `await` inside an `async` function

```js
async function checkValueExist(columnName, value){
    const [result] = await database.query(`
        SELECT * FROM users 
        WHERE ?? = ?`, [columnName, value])
    return !!result[0] // Convert to boolean (true if exists, false if not)
}
```

- In this example, in order to tell if a value in a column exist, it need to look at the database, thus will require async. 

- Using `await` to pause execution until the database query completes

  - `await` not only "pauses" the execution of an async function, but it also unwraps the Promise, giving you the actual resolved value.

    

<hr>
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

## .env

Use .env file to store fix values and use them in scripts. The file should **NEVER BE COMMITED** to Git.

- The variable in the file should be all capitalized (standard practice) and should not include whitespace when signing a value to it.

    - `npm install dotenv`

- To access the file, include this in the script: `require("dotenv").config()` 
- To access the values in the file use: `process.env.VARIABLE_NAME`

    ```js
    const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    }).promise();
    ```





## Cookies

Should add one after the user successfully signup and login

When a user successfully signing up or login, the cookie value will be stored on the server anytime amount (hence ) and browser (anytime amount). Which can be used to determine if the user is login or not when they revisit the site instead of having to re-login (long as the cookie is stored on the browser and is valid)

To do this, use the `res.cookie(cookie_name, cookie_value, cookie_configs)` method

- `cookie_name `and `cookie_value `should include no white space. 
- `cookie_value` should be encrypted and unique for each user to prevent bad actors
- `cookie_config` determine the cookie behavior on the browser.

```js
res.cookie("SimpleValidationApp", TokenValue, { 
        httpOnly: true,// if true prevents client-JavaScript from editing the cookie (like deleting)
        secure: true, // ensures the cookie is only sent over HTTPS
        sameSite: "strict", //prevent CSRF attack
        maxAge: 1000 * 60 * 60 * 24 // sets the cookie to delete on browser after 24 hours
    });
```

- **Note:** The cookie value (TokenValue) should be unique for each user visit the site, thus should be secure, unique and probably encrypted based on the user information

  - To do this install `npm install jsonwebtoken dotenv`
  - Than grab some user unique information and create the token using those values using the `sign(object, tokenvalue)` method
    - Need two parameters:
    
      - Encoded Object: any values that makes the cookie value unique based on the user 
      - Secret value that the operator of the application know (value likely stored in `.env` file)

  ```js
  const TokenValue = jwt.sign({userid: user.id, username: user.username, email: user.email}, process.env.JWT_SECRET)
  ```

    

  **Full Example:**

  ```js
  const [userData] = await database.query(`
          SELECT * FROM users 
          WHERE email = ?`, [req.body.email])
  
      const user = userData[0] // Get user info row
  
      // Create JWT token
      const TokenValue = jwt.sign({exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, userid: user.id, username: user.username, email: user.email}, process.env.JWT_SECRET)
  // Token will expire in 24hr
      
      // Set the cookie
      res.cookie("SimpleValidationApp", TokenValue, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24
      })
  ```

  **NOTE:** `exp` key for the object sets an expiration claim in the JWT payload that will cause the token to be considered invalid after 24 hours, regardless of how it's stored. **BUT** the `maxAge` will tell the browser when to delete the cookie.

  - Since both is set for 24hr, the cookie will expire and deleted in 24hrs. 
  - But if they were different:
    - If JWT token expires first, the browser token will be invalid
    - If browser token expires first, the user will close access to the token but can still technology readd the value if JWT token have not been rest.

  <u>The cookie token will expire if the server rest but the cookie might still be stored in browser</u>

  

  ### Decode Cookie Value (inside middleware)

  Decode cookie value to determine if the user is valid, if so, login the user else logout. 

  - Use the `jwt.verify(cook_name, stored_cookie_env_value)`

    ```js
    const decoded = jwt.verify(req.cookies.SimpleValidationApp, process.env.JWT_SECRET)
    ```

  - Request if the decoded value is true:

    ```js
    req.user = decoded
    ```

  - Add a try-catch to see if the cookie is valid, else return `req.user` `false`

    ```js
    try {
        const decoded = jwt.verify(req.cookies.SimpleValidationApp, process.env.JWT_SECRET)
        req.user = decoded
    } catch(err) {
        req.user = false
    }
    ```

  **To determine if user is logged in based on cookie when on homepage:**

  ```js
  app.get("/homepage", (req, res) => {
  if (req.user) {
  	res.render("userPage") // if cookie valid and exist, direct user to their page
  } else {
      res.render("homepage") // else stay in homepage
    }
  })
  ```

### Remove Cookie

To logout a cookie, its best to remove the cookie server side to prevent XSS attack.

If `httpONLY = true` when making the cookie, the cookie can only be removed from server-side, not client-side

1. To remove the cookie, first add a <u>logout route</u> in the server-side script that will delete the cookie when called in client side.

   ```js
   app.get("/logout", (req, res) => {
       req.clearCookie("cookieName", cookieObject)
       res.render("homepage") // redirect to another page after cookie is removed
   })
   ```

   - The cookie object are the attributes the cookie have thus it will be structured as a dictionary

     ```js
     app.get("/logout", (req, res) => {
         res.clearCookie("SimpleValidationApp", {
             path: "/",
             httpOnly: true,
             secure: true
             // Include all cookie options that were set when creating it
         });
         res.render("homepage")
     })
     ```

     

2. Add a event listener that will call the <u>logout route</u> when activated (button press). 

   ```js
   const logout_button = document.getElementById("logout")
   
   logout_button.addEventListener("click", function() {
       console.log("logout was clicked")
   
       // since httpOnly is true, can not delete cookie in client-side, must from server-side
       window.location.href = "/logout" // call the logout route
   });
   ```







