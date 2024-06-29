const mysql = require("mysql");
require("dotenv").config();

const con = mysql.createConnection({
  host: `${process.env.h.split("").reverse().join("").split("%%").join("")}`,
  user: process.env.u.split("sorry").join(""),
  password: process.env.p.split("$$$").join("")+"!123",
  database: "blog" || process.env.database,
});
try {
  con.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to Database");
    }
  });
} catch (err) {
  console.log(err);
}
module.exports = con;
