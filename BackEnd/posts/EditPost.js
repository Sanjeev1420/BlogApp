const con = require("../Connection/connection");
require("dotenv").config();
const AWS = require("aws-sdk");

function EditPost(req, res) {
  const { tittle, des, img, category, id } = req.body;

  if (img) {
    try {
      con.query(`SELECT img FROM posts WHERE id = ?`, [id], (err, result) => {
        if (err) {
          console.log(err);
          res.send({ status: false, msg: "Please try again later" });
        } else {
          const imageURL = result[0].img;

          // Delete image from S3
          const s3 = new AWS.S3({
            accessKeyId: process.env.a,
            secretAccessKey: process.env.s,
            region: process.env.r,
          });

          const params = {
            Bucket: process.env.bucket,
            Key: imageURL.split("/").pop(), // Extract the image file name from the URL
          };

          s3.deleteObject(params, (err, data) => {
            if (err) {
              console.log(err);
              res.send({ status: false, msg: "Please try again later" });
            } else {
              // Update post in the database
              con.query(
                `UPDATE posts SET tittle='${tittle}', img='${img}', category='${category}', des='${des}', date=NOW(),edited=1 WHERE id=${id}`,
                (err, result) => {
                  if (err) {
                    console.log(err);
                    res.send({ status: false, msg: "Please try again later" });
                  } else {
                    res.send({ status: true, msg: "Updated Successfully" });
                  }
                }
              );
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
      res.send({ status: false, msg: "Please try again later" });
    }
  } else {
    try {
      // Update post in the database
      con.query(
        `UPDATE posts SET tittle='${tittle}', category='${category}', des='${des}', date=NOW(),edited=1 WHERE id=${id}`,
        (err, result) => {
          if (err) {
            console.log(err);
            res.send({ status: false, msg: "Please try again later" });
          } else {
            res.send({ status: true, msg: "Updated Successfully" });
          }
        }
      );
    } catch (err) {
      res.send({ status: false, msg: "Please try again later" });
    }
  }
}

module.exports = EditPost;
