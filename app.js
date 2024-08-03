const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const flash = require('connect-flash');
const expressSession = require("express-session");
require("dotenv").config();

const db = require("./config/mongoose-connection"); // Ensure this file exists and sets up your database connection
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const productsRouter = require("./routes/productsRouter");
const indexRouter = require("./routes/indexRouter");

// Middleware for parsing JSON, urlencoded data, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());

// Static files and view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
