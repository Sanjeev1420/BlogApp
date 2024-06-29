import React, { useEffect, useState } from "react";
import { Auth, Redirect, jsonwebtoken, post } from "../Atom/Atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "../axios/Axios";
import { toast } from "react-toastify";
import { Form, ToastContainer } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "../stylesheet/comments.scss";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon, WhatsappShareButton,
  TwitterShareButton,
} from "react-share";
export const Comment = () => {
  const [id, setId] = useRecoilState(post);
  const [user, setUser] = useRecoilState(Auth);
  const jwt = useRecoilValue(jsonwebtoken);
  const [mycomment, setMycomment] = useState([]);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const [redirect, setRedirect] = useRecoilState(Redirect);
  const [edit, setEdit] = useState(false);
  const [t, setT] = useState(1);
  const [contents, setContents] = useState();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const p = queryParams.get("post");
  useEffect(() => {
    if (user.status) {
      axios
        .post(
          "/getcomment",
          {
            postId: p,
          },
          {
            headers: { jwt_token: jwt },
          }
        )
        .then(async (result) => {
          await setComments(result.data.othercomment);
          await setMycomment(result.data.mycomment);
        });
    } else {
      axios
        .post("/allcomments", {
          postId: p,
        })
        .then(async (result) => {
          await setComments(result.data.comment);
        });
    }
  }, [t]);

  const handleAddcomment = (e) => {
    e.preventDefault();
    if (user.status) {
      axios
        .post(
          "/addcomment",
          {
            postId: p,
            comment: content,
          },
          {
            headers: { jwt_token: jwt },
          }
        )
        .then(async (result) => {
          if (result.data.status) {
            await setContent("");
            await setT((t) => t + 1);
            toast.success("Comment Added");
          } else {
            toast.error("Something went wrong");
          }
        });
    } else {
      toast.warning("Please Login to comment");
      setTimeout(() => {
        setRedirect("/single");
        navigate("/login");
      }, 2000);
    }
  };
  const handleDelete = (e, id) => {
    e.preventDefault();
    axios
      .post("/deletecomment", {
        commentId: p,
      })
      .then((result) => {
        if (result.data.status) {
          toast.success("Comment Delete Successfully");
          setT((prev) => prev + 1);
        }
      })
      .catch((err) => console.log(err));
  };
  const handleEdit = (e, id) => {
    e.preventDefault();
    axios
      .post("/editcomment", {
        commentId: p,
        content: contents,
      })
      .then((result) => {
        if (result.data.status) {
          toast.success("Comment Edited Successfully");
          setT((prev) => prev + 1);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <ToastContainer />
     <h4> Share on</h4>
      <div className="d-flex justify-content-left gap-4" style={{margin:"1em 0em"}}>
        <FacebookShareButton
          url={location}
          quote={"Make Something different"}
          hashtag="#mindverse"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          url={location}
          quote={"Make Something different"}
          hashtag="#mindverse"
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <WhatsappShareButton
          url={location}
          quote={"Make Something different"}
          hashtag="#mindverse"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
      <h4>Comments</h4>
      <form onSubmit={handleAddcomment}>
        <textarea
          className="form-control"
          type="text"
          disabled={!user.status}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            !user.status ? "Please Login to write Comment" : "Write a Comment"
          }
        />

        <button
          type="submit"
          className="btn btn-primary"
          disabled={content.length < 2}
          style={{ margin: "1em 0em" }}
        >
          Add Comment
        </button>
      </form>

      {mycomment.map((comment, index) => (
        <div className="comment-container">
          <p className="user-name">
            {comment.username}
            {"  "}
            <l className="date">
              {" "}
              {new Date(comment.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {"  "}
              {comment.Edited == 1 ? "Edited" : null}
            </l>
          </p>
          <k className="comment"> {comment.content} </k>
          <div
            className="d-flex justify-content-left gap-4"
            style={{ marginLeft: "2em", marginTop: "1em" }}
          >
            {edit ? (
              <>
                <textarea
                  className="form-control"
                  type="text"
                  value={contents}
                  onChange={(e) => setContents(e.target.value)}
                />
                <button
                  onClick={(e) => handleEdit(e, comment.comment_id)}
                  className="btn btn-outline-secondary"
                  disabled={contents.length < 2 || contents == comment.content}
                >
                  Save
                </button>
              </>
            ) : null}
            <button
              className="btn btn-info"
              onClick={(e) => {
                setEdit((prev) => !prev);
                setContents(comment.content);
              }}
            >
              {!edit ? "Edit" : "Cancel"}
            </button>
            {!edit ? (
              <button
                className="btn btn-danger"
                onClick={(e) => handleDelete(e, comment.comment_id)}
              >
                Delete
              </button>
            ) : null}
          </div>
          <hr />
        </div>
      ))}

      {comments.map((comment, index) => (
        <div className="comment-container">
          <p className="user-name">
            {comment.username}
            {"  "}
            <l className="date">
              {" "}
              {new Date(comment.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {"  "}
              {comment.Edited == 1 ? "Edited" : null}
            </l>
          </p>
          <k className="comment"> {comment.content} </k>
          <hr />
        </div>
      ))}
    </div>
  );
};
