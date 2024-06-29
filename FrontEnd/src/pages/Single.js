import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "../axios/Axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { Auth, jsonwebtoken, Load, post, Redirect } from "../Atom/Atom";
import "../stylesheet/Single.scss";

import Loading from "./Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HeartFill } from "react-bootstrap-icons";
import { SimilarPost } from "./SimilarPost";
import { Comment } from "./Comment";
export const Single = () => {
  const [posts, setPosts] = useState([]);
  const [id, setId] = useRecoilState(post);
  const [similar, setSimilar] = useState();
  const jwt = useRecoilValue(jsonwebtoken);
  const [loading, setLoading] = useRecoilState(Load);
  const [user, setUser] = useRecoilState(Auth);
  const [like, setLike] = useState();
  const [liked, setLiked] = useState();
  const navigate = useNavigate();
  const [redirect, setRedirect] = useRecoilState(Redirect);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const p = queryParams.get("post");
  useEffect(() => {
    
    setLoading(true);
    axios
      .post(`/posts?id=${p}`, { jwt: jwt }, { withCredentials: true })
      .then(async (res) => {
        setLoading(false);
        await setPosts(res.data.result);
        await setSimilar(res.data.similarPost);
      })
      .catch((err) => {
        console.log(err);
      });
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    axios
      .post("/like", {
        postId: p,
      })
      .then(async (result) => {
        await setLike(result.data.like);
      })
      .catch((err) => console.log(err));
    axios
      .post(
        "/getlike",
        {
          postId: p,
        },
        {
          headers: { jwt_token: jwt },
        }
      )
      .then((res) => {
        setLiked(res.data.like);
      })
      .catch((err) => console.log(err));
  }, []);
  const handleLike = () => {
    if (user.status) {
      axios
        .post(
          "/putlike",
          { postId: p },
          {
            headers: {
              jwt_token: jwt,
            },
          }
        )
        .then((res) => {
          if (res.status) {
            setLiked(1);
            setLike((prev) => prev + 1);
          }
        });
    } else {
      toast.warning("please Login to Continue");
      setTimeout(() => {
        setRedirect("/single");
        navigate("/login");
      }, 2000);
    }
  };
  const share = () => {
    navigator
      .share({
        title: "Mindverse",
        url: window.location.href,
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing:", error));
  };
  const handleUnlike = () => {
    if (user.status) {
      axios
        .post(
          "/unlike",
          {
            postId: p,
          },
          {
            headers: {
              jwt_token: jwt,
            },
          }
        )
        .then((result) => {
          if (result.data.status) {
            setLiked(0);
            setLike((prev) => prev - 1);
          }
        });
    } else {
      toast.warning("please Login to Continue");
      setTimeout(() => {
        setRedirect("/single");
        navigate("/login");
      }, 2000);
    }
  };
  const dates = new Date(posts.date);
  const d = dates.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Container fluid>
          <Row>
            <Col md={8} sm={12} xs={12}>
              <div className="Single">
                <img src={posts.img} className="rounded mx-auto d-block" />
                <div className="group">
                  <span>{posts.category}</span>
                  <span>{d}</span>
                  <span>{posts.edited?"Edited":null}</span>
                </div>
                <h>{posts.tittle}</h>

                <p>
                  <span className="user-name">{posts.username}</span>
                </p>
                {liked === 0 ? (
                  <button
                    onClick={handleLike}
                    className="btn btn-outline-primary"
                    style={{ marginLeft: "1em" }}
                  >
                    <HeartFill /> {like} Likes
                  </button>
                ) : (
                  <button
                    onClick={handleUnlike}
                    className="btn btn-danger"
                    style={{ marginLeft: "1em" }}
                    disabled={!user.status}
                  >
                    <HeartFill /> {like} Likes
                  </button>
                )}
                <br />

                <div
                  dangerouslySetInnerHTML={{ __html: posts.des }}
                  className="description"
                ></div>
                <Comment />
              </div>
            </Col>
            <Col md={4} sm={12} xs={12}>
              <div className="similar-post" style={{marginTop:"2em"}}>
                <h1>Similar posts from {posts.username}</h1>
                {similar === undefined || similar.length === 0 ? (
                  <>No posts</>
                ) : (
                  similar.map((posts, index) => <SimilarPost pt={posts} />)
                )}
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};
