const express = require("express");
const path = require("path");
const app = express();

const PORT_NUM = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(PORT_NUM, () => console.log(`Server running on ${PORT_NUM}`));
