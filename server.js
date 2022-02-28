const express = require("express");
const app = express();
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("layout")
})

/* ---------------------------------------- 
  Assets
---------------------------------------- */
app.use(express.static("public"));

/* ---------------------------------------- 
  Set template engine
---------------------------------------- */
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");


/* ---------------------------------------- 
  Start server
---------------------------------------- */
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});