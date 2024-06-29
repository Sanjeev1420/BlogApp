var jwt = require("jsonwebtoken");
const con = require("../Connection/connection");
const AWS = require("aws-sdk");
require("dotenv").config();

const Delete = (req, res) => {
  try {
    var id = req.body.id;
    con.query(`SELECT img FROM posts WHERE id = ?`, [id], (err, result) => {
      if (err) {
        console.log(err);
        res.send({ status: false, msg: "Please try again later" });
      } else {
        const imageURL = result[0].img;

        // Delete image from S3
        const s3 = new AWS.S3({
          accessKeyId: process.env.a.split("90").join(""),
          secretAccessKey: process.env.s
            .split("")
            .reverse()
            .join("")
            .split("66")
            .join(""),

          region: process.env.r,
        });

        const params = {
          Bucket: process.env.bucket.split("****").join(""),
          Key: imageURL.split("/").pop(), // Extract the image file name from the URL
        };
        s3.deleteObject(params, (err, data) => {
          if (err) {
            console.log(err);
            res.send({ status: false, msg: "Please try again later" });
          } else {
            // Delete post from the database
            con.query("DELETE FROM posts WHERE id = ?", [id], (err, result) => {
              if (err) {
                console.log(err);
                res.send({ status: false, msg: "Please try again later" });
              } else {
                res.send({ status: true, msg: "Deleted Successfully" });
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ status: false, msg: "Please try again later" });
  }
};

module.exports = Delete;
