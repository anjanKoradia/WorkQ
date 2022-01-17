const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------------------------------- 
  Start server
---------------------------------------- */
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});