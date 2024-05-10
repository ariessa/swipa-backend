const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

// Load .env file contents into process.env
dotenv.config();

var app = express();

const origin = process.env.FRONTEND_DEV_URL;
const corsOptions = {
  origin: origin,
  credentials: true,
};

app.use(cors(corsOptions));
app.listen(4000);
