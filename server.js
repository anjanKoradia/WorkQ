const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

/* ---------------------------------------- 
  Database connection 
---------------------------------------- */
const url = "mongodb://localhost/WorkQ";
mongoose.connect(url).then(
  () => {
    console.log("Database connected...");
  },
  (err) => {
    console.log("Connection failed...");
  }
);

/* ---------------------------------------- 
  Assets
---------------------------------------- */
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* ---------------------------------------- 
  Set template engine
---------------------------------------- */
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

/* ---------------------------------------- 
  App Config
---------------------------------------- */
global.appRoot = path.resolve(__dirname);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* ---------------------------------------- 
  Routes
---------------------------------------- */
require("./routes/web")(app);

/* ---------------------------------------- 
  Start server
---------------------------------------- */
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});