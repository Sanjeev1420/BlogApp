var jwt = require("jsonwebtoken");
const con = require("../Connection/connection");
require("dotenv").config();

const GetComments = (req, res) => {
  const { postId } = req.body;

  const { jwt_token } = req.headers;
  try {
    const decode = jwt.verify(jwt_token, process.env.jwt_token);
    con.query(
      `select * from comments
        join auth on comments.user_id=auth.userid
         where comments.post_id=${postId} and comments.user_id=${decode.id}`,
      (err, result) => {
        if (err) console.log(err);
        else {
          con.query(
            `select * from comments
                join auth on comments.user_id=auth.userid
                 where comments.post_id=${postId} and comments.user_id<>${decode.id} 
                `,
            (err, result1) => {
              if (err) console.log(err);
              else {
                res.json({ mycomment: result, othercomment: result1 });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
};

const AllComments = (req, res) => {
  const { postId } = req.body;

  try {
    con.query(
      `select * from comments
        join auth on comments.user_id=auth.userid
         where comments.post_id=${postId}`,
      (err, result) => {
        if (err) console.log(err);
        else {
          res.json({ comment: result });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ status: false });
  }
};

const Addcomment = (req, res) => {
  const { postId, comment } = req.body;

  const { jwt_token } = req.headers;
  try {
    const decode = jwt.verify(jwt_token, process.env.jwt_token);
    const values = [[postId, decode.id, comment]];
    con.query(
      `insert into comments (post_id,user_id,content) values ?`,
      [values],
      (err, result) => {
        if (err) console.log(err);
        else {
          res.json({ status: true });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};

const EditComment = (req, res) => {
  const { commentId, content } = req.body;
  console.log(content);
  try {
    con.query(
      `UPDATE comments SET content = '${content}', edited = '${1}', created_at = NOW() WHERE comment_id = ?`,
      [commentId],
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({ error: err });
        } else {
          con.query("commit");

          res.json({ status: true });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

const DeleteComment = (req, res) => {
  const { commentId } = req.body;

  try {
    con.query(
      `DELETE FROM comments WHERE comment_id = ?`,
      [commentId],
      (err, result) => {
        if (err) {
          console.log(err);
          res.json({ error: err });
        } else {
          con.query("commit");
          res.json({ status: true });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};

module.exports = {
  Addcomment,
  GetComments,
  AllComments,
  EditComment,
  DeleteComment,
};
