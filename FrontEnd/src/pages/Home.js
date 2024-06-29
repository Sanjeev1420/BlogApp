import React, { useEffect, useState } from "react";
import { Button, Carousel, Container } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  categoryPostState,
  Count,
  jsonwebtoken,
  Load,
  post,
  Posts,
} from "../Atom/Atom";
import axios from "../axios/Axios";
import "../stylesheet/Home.scss";
import Display from "./Display";
import Loading from "./Loading";
import { useLocation, useNavigate } from "react-router-dom";
export const Home = () => {
  const [pt, setPost] = useRecoilState(Posts);
  const [status, setStatus] = useState(false);
  const [count, setCount] = useRecoilState(Count);
  const [len, setLen] = useState(0);
  const jwt = useRecoilValue(jsonwebtoken);
  const [categoryPost, setcategoryPost] = useRecoilState(categoryPostState);
  const [loading, setLoading] = useRecoilState(Load);
  const [carouselPosts, setCarouselPosts] = useState([]);
  const [p, setP] = useRecoilState(post);
  const navigate=useNavigate();
  const location=useLocation();
  useEffect(() => {
    axios
      .get("/carousel")
      .then((result) => {
        setCarouselPosts(result.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    setLoading(true);
    axios
      .post(
        `posts?category=${categoryPost.category}`,
        { jwt: jwt },
        { withCredentials: true }
      )
      .then(async (res) => {
        setLoading(false);
        if (res.data.status) {
          await setStatus(true);
          setLen(res.data.result.length);
          await setPost(res.data.result.slice(count, count + 10));
          window.scrollTo(0, 0);
        } else {
          setStatus(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [categoryPost, count]);

  const handleNext = (e) => {
    e.preventDefault();
    setCount((prev) => prev + 10);
  };
  const handleBack = (e) => {
    e.preventDefault();
    setCount((prev) => prev - 10);
  };
function convertDate(dd)
{
  const dates = new Date(dd);
  const d = dates.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return d
}
const handle = (e,id) => {
  e.preventDefault();
  const queryParams = new URLSearchParams(location.search);
    queryParams.set('post', id);
    navigate({
      pathname: '/single',
      search: '?' + queryParams.toString()
    });
    
};
  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <>
          {!categoryPost.status ? (
            <Carousel>
              {carouselPosts.map((pt) => (
                <Carousel.Item key={pt.id} interval={1000} onClick={(e)=>handle(e,pt.id)} style={{cursor:"pointer"}}>
                <img
                  className="d-block w-100"
                  style={{ maxHeight: "40em" }}
                  src={pt.img}
                  alt={pt.tittle}
                />
                <Carousel.Caption>
                  <h className="carousel-tittle">{pt.tittle}</h>
                  <p className="carousel-category">{pt.category}</p>
                  <p className="carousel-date">{convertDate(pt.date)}</p>
                </Carousel.Caption>
              </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <></>
          )}
          {status ? (
            pt.map((post, index) => (
              <Display
                flag={false}
                category={post.category}
                ind={index}
                name={post.username}
                img={post.img}
                id={post.id}
                date={post.date}
                edited={post.edited}
                tittle={post.tittle}
                desc={post.n}
                n={post.des}
              />
            ))
          ) : (
            <p>No Posts</p>
          )}

          {len > 10 && count !== 0 ? (
            <Button onClick={handleBack} variant="info float-start">
              Previous page
            </Button>
          ) : (
            <></>
          )}
          {len > 10 && len > count + 10 ? (
            <Button onClick={handleNext} variant="info rounded mx-auto d-block">
              Next page
            </Button>
          ) : (
            <></>
          )}
        </>
      )}
    </Container>
  );
};
