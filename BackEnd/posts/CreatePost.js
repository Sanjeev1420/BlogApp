const jwt = require("jsonwebtoken");
const con = require("../Connection/connection");
require("dotenv").config();

const CreatePost = async (req, res) => {
  try {
    const { tittle, des, img, date, category } = req.body;

    const decoded = await jwt.verify(req.body.jwt, process.env.jwt_token);
    const id = decoded.id;
    const values = [[tittle, des, img, date, id, category]];
    con.query(
      "INSERT INTO posts(tittle, des, img, date, uid, category) VALUES ?",
      [values],
      (error, result, fields) => {
        if (error) {
          res.json({
            status: false,
            result: error,
            msg: "Please try after some time",
          });
        } else {
          res.json({ status: true, msg: "Uploaded Successfully" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      result: error,
      msg: "Please try after some time",
    });
  }
};

module.exports = CreatePost;
