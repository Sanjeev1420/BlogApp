import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import { deletePost, jsonwebtoken, Load, Posts } from "../Atom/Atom";
import axios from "../axios/Axios";
import "../stylesheet/Home.scss";
import Display from "./Display";
import Loading from "./Loading";
export const Mypost = () => {
  const [status, setStatus] = useState(false);
  const [post, setPost] = useRecoilState(Posts);
  const [count, setCount] = useState(0);
  const [len, setLen] = useState(0);
  const jwt=useRecoilValue(jsonwebtoken);
  const p=useRecoilValue(deletePost);
  const navigate=useNavigate();
  const[loading,setLoading]=useRecoilState(Load)
  useEffect(() => {
    setLoading(true);
    axios
      .post("posts?userid=1", {jwt:jwt},{ withCredentials: true })
      .then(async (res) => {
        setLoading(false)
        if (res.data.status) {
          await setStatus(true);
          setLen(res.data.result.length);
          await setPost(res.data.result.slice(count,count+10));
          window.scrollTo(0,0);
        } else {
          setStatus(false);
        
        }
      })
      .catch((err) => {
        console.log(err);
      });}
  , [count,p,jwt]);
  const handleNext=(e)=>{
    e.preventDefault();
    setCount(prev=>prev+10);
  }
  const handleBack=(e)=>{
    e.preventDefault();
    setCount(prev=>prev-10);
  }

  return (<>{loading?(<Loading />):(
    <Container fluid>
      {!status ? (
        <p>No Posts</p>
      ) : (
        post.map((post, index) => (
          <Display
            flag={true}
            category={post.category}
            ind={index}
            name={post.username}
            img={post.img}
            edited={post.edited}
            id={post.id}
            date={post.date}
            tittle={post.tittle}
            desc={post.n}
            n={post.des}
          />
        ))
      )}
      {len > 10 && count !== 0 ? <Button onClick={handleBack}  variant="outline-primary float-start">Previous page</Button> : <></>}
      {len > 10 && len>count+10 ? <Button onClick={handleNext}  variant="outline-primary rounded mx-auto d-block">Next page</Button> : <></>}
    </Container>)}</>
  );
};
