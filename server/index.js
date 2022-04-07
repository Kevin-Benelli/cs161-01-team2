const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000; // localhost 5000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
