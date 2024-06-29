const con = require("../Connection/connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Posts = async (req, res) => {
  try {
    if (req.query.id) {
      const postId = req.query.id;
      const q = `SELECT posts.id,posts.tittle,posts.category,auth.username,posts.img,posts.date,posts.des,auth.userid,posts.edited FROM posts JOIN auth ON auth.userid = posts.uid WHERE posts.id = ?`;
      await con.query(q, [postId],async (error, result, fields) => {
        if (result.length === 0) {
          res.json({ status: false, error: "Post not found" });
        } else {
          var userid=result[0].userid;
          
          var p=`SELECT posts.id,posts.tittle,posts.category,auth.username,posts.img,posts.date,posts.edited FROM posts JOIN auth ON auth.userid = posts.uid where posts.uid=${userid} and posts.id<>${postId} ORDER BY posts.id DESC limit 5`;
          await con.query(p,(err,r)=>{
            if(err)
                console.log(err);
            else
            {
              res.json({ result: result[0], status: true,similarPost:r });
            }    
          })
          //res.json({ result: result[0], status: true });
        }
      });
    } else if (req.query.category) {
      const category = req.query.category;
      const q = `SELECT posts.id,posts.tittle,posts.category,auth.username,posts.img,posts.date,posts.edited FROM posts JOIN auth ON posts.uid = auth.userid WHERE posts.category = ? ORDER BY posts.id DESC`;
     await  con.query(q, [category], (error, result, fields) => {
        if (result.length === 0) {
          res.json({ status: false, error: "No posts found for this category" });
        } else {
          res.json({ result: result, status: true });
        }
      });
    } else {
      let decoded;
      try {
        decoded =await jwt.verify(req.body.jwt, process.env.jwt_token);
      } catch (err) {
        console.log(err);
      }

      if (decoded && decoded.id && req.query.userid) {
        const userId = decoded.id;
        const q = `SELECT posts.id,posts.tittle,posts.category,auth.username,posts.img,posts.date,posts.edited FROM posts JOIN auth ON posts.uid = auth.userid WHERE posts.uid = ? ORDER BY posts.id DESC`;
       await  con.query(q, [userId], (error, result, fields) => {
          if (result.length === 0) {
            res.json({ status: false, error: "No posts found for this user" });
          } else {
            res.json({ result: result, status: true });
          }
        });
      } else {
        const q = `SELECT posts.id,posts.tittle,posts.category,auth.username,posts.img,posts.date,posts.edited FROM posts JOIN auth ON auth.userid = posts.uid ORDER BY posts.id DESC`;
        await con.query(q, (error, result, fields) => {
          console.log(error)
          if (result.length === 0) {
            res.json({ status: false });
          } else {
            res.json({ result: result, status: true });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ status: false, error: error.message });
  }
};

module.exports = Posts;
