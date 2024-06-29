const express = require("express");
const cors = require("cors");
const formData = require('express-form-data');

const routers = require("./Routes");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use(formData.parse());

app.use(
  cors({
    origin: ["http://localhost:3000","https://mindverse.netlify.app","https://blog-app-ten-green.vercel.app"],
    credentials: true,
  })
);

app.use("", routers);

app.listen(8000, () => {
  console.log("Running");
});