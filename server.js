const express = require("express");
const { resolve } = require("path");
const app = express();

app.use("/", express.static(resolve(__dirname, "./")));

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log("Tudo funcionando certinho");
});