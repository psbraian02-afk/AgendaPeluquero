const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const fssync = require("fs");
const { v4: uuidv4 } = require("uuid");
const compression = require("compression");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});
