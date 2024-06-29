var jwt = require("jsonwebtoken");
const con = require("../Connection/connection");
require("dotenv").config();

const Like = (req, res) => {
  const {postId} = req.body;
  const { jwt_token } = req.headers;
  try {
    const decode = jwt.verify(jwt_token, process.env.jwt_token);
    const values = [[postId, decode.id, 1]];
    con.query(
      `insert into posts_like(postId,userId,likes) values ?`,
      [values],
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({ status: false, msg: "something went wrong" });
        } else {
          res.json({ status: true });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.json({ status: false, msg: "something went wrong" });
  }
};

module.exports = Like;
