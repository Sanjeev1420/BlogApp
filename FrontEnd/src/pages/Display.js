import { Col, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { deletePost, post,EditPost } from "../Atom/Atom";
import "../stylesheet/Display.scss";
import { Button, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "../axios/Axios";
import { toast } from "react-toastify";
import { Trash3Fill } from "react-bootstrap-icons";

const Display = ({ ind, img, id, tittle, n, date, name, category, flag,edited }) => {
  const navigate = useNavigate();
  const [p, setP] = useRecoilState(post);
  const [showConfirm, setShowConfirm] = useState(false);
  const [del, Setdel] = useRecoilState(deletePost);
  const [like, setLike] = useState();
  const location = useLocation();
  const [editpost,setEditPost]=useRecoilState(EditPost)
  useEffect(() => {
    axios
      .post("/like", {
        postId: id,
      })
      .then(async (result) => {
        await setLike(result.data.like);
      })
      .catch((err) => console.log(err));
  }, []);

  const handle = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("post", id);
    navigate({
      pathname: "/single",
      search: "?" + queryParams.toString(),
    });
  };

  const handleConfirmDelete = () => {
    axios
      .post("/delete", { id: id })
      .then((res) => {
        if (res.data.status) {
          Setdel((prev) => !prev);
          toast.success(`Deleted Successfully`, {
            position: toast.POSITION.TOP_RIGHT,
            closeOnClick: false,
            pauseOnHover: true,
          });
        } else {
          toast.warning(`Try After sometime`, {
            position: toast.POSITION.TOP_RIGHT,
            closeOnClick: false,
            pauseOnHover: true,
          });
        }
      })
      .catch((err) => console.log(err));
    setShowConfirm(false);
  };
  const handleEdit=(e)=>
  {
    e.preventDefault();
    setEditPost(id);
    navigate("/edit")
    
  }
  const dates = new Date(date);
  const d = dates.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="Display">
      <Row key={ind}>
        {ind % 2 === 0 ? (
          <>
            <Col md={5} sm={12} xs={12}>
              <div className="img-left">
                <img
                  src={img}
                  alt=""
                  className=" rounded mx-auto d-block img-fluid"
                />
              </div>
            </Col>
            <Col md={1} sm={0} xs={0}></Col>
            <Col md={6} xs={12} sm={12}>
              <h className="tittle">{tittle}</h>
              <div className="group">
                <span>{category}</span>
                <span>{d}</span>
                <span>{edited?"Edited":null}</span>
              </div>
              <p>
                <span className="user-name"> {name}</span>
              </p>
              <p className="like">{like} likes</p>
              <div class="d-flex justify-content-start" style={{ gap: "5px" }}>
                <button onClick={handle} className="btn btn-outline-primary">
                  Readmore...
                </button>{" "}
                {flag ? (
                  <>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => setShowConfirm(true)}
                    >
                      <Trash3Fill />
                    </button>
                    <button className="btn btn-outline-danger" onClick={(e)=>handleEdit(e)}>Edit</button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Col>
          </>
        ) : (
          <>
            <Col md={6} xs={12} sm={12}>
              <h className="tittle">{tittle}</h>

              <div className="group">
                <span>{category}</span>
                <span>{d}</span>
                <span>{edited?"Edited":null}</span>
              </div>
              <p>
                <span className="user-name"> {name}</span>
              </p>

              <p className="like">{like} likes</p>
              <div class="d-flex justify-content-start" style={{ gap: "5px" }}>
                <button onClick={handle} className="btn btn-outline-primary">
                  Readmore...
                </button>{" "}
                {flag ? (<>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => setShowConfirm(true)}
                  >
                    <Trash3Fill />
                  </button>
                  <button className="btn btn-outline-danger" onClick={(e)=>handleEdit(e)}>Edit</button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Col>

            <Col md={5} sm={12} xs={12}>
              <div className="img-right">
                <img src={img} className="img-fluid" />
              </div>
            </Col>
            <Col md={1} sm={0} xs={0}></Col>
          </>
        )}
      </Row>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Display;
