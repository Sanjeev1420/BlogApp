var jwt = require("jsonwebtoken");
const con = require("../Connection/connection");
require("dotenv").config();

const Unlike = (req, res) => {
    // Extract postId and jwt_token from request body and headers
    const {postId} = req.body;
    const { jwt_token } = req.headers;
    
    // Verify JWT token
    try {
      const decode = jwt.verify(jwt_token, process.env.jwt_token);
      // Execute a SQL DELETE statement to remove the like from the database
      con.query(
        `delete from posts_like where userid=${decode.id} and postId=${postId}`,
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
  
  module.exports = Unlike;
  