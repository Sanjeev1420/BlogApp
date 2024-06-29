import axios from "../axios/Axios.js";
import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Row,
  ToastContainer,
} from "react-bootstrap";
import Dropzone from "react-dropzone"; // Import the Dropzone component

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "../stylesheet/Write.scss";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { EditPost, jsonwebtoken, Load } from "../Atom/Atom.js";
import Loading from "./Loading.js";
import { useEffect } from "react";

const Editpost = () => {
  const [tittle, setTittle] = useState("");
  const [category, setCategory] = useState("");
  const [des, setDes] = useState("");
  const [image, setImage] = useState(null);
  const [imageurl, setImageurl] = useState(null);
  const [imageName, setImageName] = useState();
  const navigate = useNavigate();
  const jwt = useRecoilValue(jsonwebtoken);
  const [loading, setLoading] = useRecoilState(Load);
  const [editpost, setEditPost] = useRecoilState(EditPost);
  const [temp, setTemp] = useState();
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (tittle || category || des || image) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [tittle, category, des, image]);

  useEffect(() => {
    if (editpost === -1) {
      navigate("/");
    }
    setLoading(true);
    axios
      .post(`/posts?id=${editpost}`, { jwt: jwt }, { withCredentials: true })
      .then(async (res) => {
        setLoading(false);
        await setTemp(res.data.result);
        setTittle(res.data.result.tittle);
        setDes(res.data.result.des);
        setCategory(res.data.result.category);
        setImageurl(res.data.result.img);
      })
      .catch((err) => {
        console.log(err);
      });
    return;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    var flag = true;
    if (tittle.length < 10) {
      flag = false;
      toast.warning("Title length is small", {
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: false,
        pauseOnHover: true,
      });
    }
    if (des.length < 100) {
      flag = false;
      toast.info("Write some more", {
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: false,
        pauseOnHover: true,
      });
    }
    if (category.length === 0) {
      flag = false;
      toast.info("Select the Category", {
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: false,
        pauseOnHover: true,
      });
    }

    if (!flag) {
      return; // Stop further execution if validation fails
    }

    if (image === null && imageurl === null) {
      toast.warning("Please Choose Image");
      return; // Stop further execution if image is not selected
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", imageName);
    if (imageurl === null) {
      try {
        setLoading(true);
        const uploadResponse = await axios.post("/uploadimage", formData, {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });

        if (uploadResponse.data.status) {
          setImageurl(uploadResponse.data.location);

          setLoading(true);

          try {
            const addPostResponse = await axios.post("/edit", {
              tittle: tittle,
              des: des,
              id: editpost,

              img: uploadResponse.data.location,
              category: category,
            });

            await setLoading(false);

            if (addPostResponse.data.status) {
              toast.success(addPostResponse.data.msg, {
                position: toast.POSITION.TOP_RIGHT,
                closeOnClick: false,
                pauseOnHover: true,
              });

              setTimeout(() => {
                navigate("/mypost");
              }, 5000);
            } else {
              toast.info(addPostResponse.data.msg, {
                position: toast.POSITION.TOP_RIGHT,
                closeOnClick: false,
                pauseOnHover: true,
              });
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          toast.error("Try After Sometime");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const addPostResponse = await axios.post("/edit", {
          tittle: tittle,
          des: des,
          id: editpost,
          img: null,
          category: category,
        });
        await setLoading(false);

        if (addPostResponse.data.status) {
          toast.success("Post has been updated", {
            position: toast.POSITION.TOP_RIGHT,
            closeOnClick: false,
            pauseOnHover: true,
          });

          setTimeout(() => {
            navigate("/mypost");
          }, 5000);
        } else {
          toast.info("Can't process at this moment", {
            position: toast.POSITION.TOP_RIGHT,
            closeOnClick: false,
            pauseOnHover: true,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <div className="write-container">
            <form>
              <Row>
                <Col md={8}>
                  <div className="content">
                    <h2>Title</h2>
                    <Form.Control
                      type="text"
                      placeholder="Title"
                      value={tittle}
                      onChange={(e) => setTittle(e.target.value)}
                    />
                    <h2>Description</h2>
                    <div className="editorContainer">
                      <ReactQuill
                        theme="snow"
                        className="editor"
                        value={des}
                        onChange={setDes}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="menu">
                    <div className="item">
                      <h2>Category</h2>
                      <Form.Select
                        aria-label="Default select example"
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Business and finance">
                          Business and finance
                        </option>
                        <option value="Technology">Technology</option>
                        <option value="News and current events">
                          News and current events
                        </option>
                        <option value="Arts and culture">
                          Arts and culture
                        </option>
                      </Form.Select>
                    </div>
                    <div className="item">
                      <h2>Image</h2>
                      {image || imageurl ? (
                        <>
                          <img
                            src={image || imageurl}
                            alt="Selected"
                            className="selected-image"
                          />

                          <button
                            className="btn btn-danger"
                            style={{ marginTop: "1em" }}
                            onClick={() => {
                              setImage(null);
                              setImageurl(null);
                            }}
                          >
                            Remove Image
                          </button>
                        </>
                      ) : (
                        <Dropzone onDrop={handleDrop}>
                          {({ getRootProps, getInputProps }) => (
                            <div className="dropzone" {...getRootProps()}>
                              <input
                                {...getInputProps({ accept: "image/*" })}
                              />
                              <p>
                                Drag and drop an image here, or click to select
                                
                              </p>
                            </div>
                          )}
                        </Dropzone>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={4} xs={0}></Col>
                <Col md={4} xs={0}>
                  <Button
                    onClick={handleSubmit}
                    style={{ marginTop: "1em" }}
                    className="outline-success"
                  >
                    Update
                  </Button>
                </Col>
                <Col md={4} xs={0}></Col>
              </Row>
            </form>
          </div>
        </Container>
      )}
    </>
  );
};

export default Editpost;
