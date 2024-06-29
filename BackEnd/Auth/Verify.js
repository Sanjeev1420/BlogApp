var jwt = require("jsonwebtoken");
const con = require("../Connection/connection");
require("dotenv").config();

const Verify = (req, res) => {
  try {
    jwt.verify(req.body.jwt, process.env.jwt_token, async (err, decoded) => {
      if (err) {
        
        res.json({ status: false });
      } else {
        
        await con.query(
          `select * from auth where userid=${decoded.id}`,
          (err, result) => {
            if (err) {
              res.json({ status: false })
            } else {
              res.json({ status: true, id: decoded.id, name: result[0].username });
            }
          }
        );
      }
    });
  } catch (err) {
    res.json({ status: false });
  }
};

module.exports = Verify;
