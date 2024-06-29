import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../stylesheet/Navbar.scss";
import { useRecoilState } from "recoil";
import {
  Auth,
  categoryPostState,
  Count,
  jsonwebtoken,
  Load,
  Redirect,
} from "../Atom/Atom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import axios from "../axios/Axios";
import { NavDropdown } from "react-bootstrap";

//Handling Navbars
export const Navbars = () => {
  const [user, setUser] = useRecoilState(Auth);

  const [categoryPost, setCategoryPost] = useRecoilState(categoryPostState);
  const [jwt, setJwt] = useRecoilState(jsonwebtoken);
  const [loading, setLoading] = useRecoilState(Load);
  const[redirect,setRedirect]=useRecoilState(Redirect)
  useEffect(() => {
    if (!user.status && jwt !== undefined && jwt !== null) {
      setLoading(true);
      axios
        .post("/verify", { jwt: jwt }, { withCredentials: true })
        .then(async (res) => {
          if (res.data.status) {
            setLoading(false);
            await setUser({ name: res.data.name, status: true });
          } else {
            localStorage.removeItem("jwt");
            setJwt(null);
          }
        });
    }
  }, []);
  const [count, setCount] = useRecoilState(Count);
  const navigate = useNavigate();

  //Handling Logout Function
  const handleLogin = async (e) => {
    e.preventDefault();
    if (user.status) {
      localStorage.removeItem("jwt");
      setJwt(null);
      navigate("/");
      await setUser({ name: null, status: false });
    } else {
      navigate("/login");
    }
  };
  const myPost = (e) => {
    e.preventDefault();
    if (user.status) {
      navigate("/mypost");
    } else {
      toast.warning("Please Login to View Your Post", {
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: false,
        pauseOnHover: true,
      });
      setTimeout(() => {
        setRedirect("/mypost");
        navigate("/login");
      }, 3000);
    }
  };
  const handleWrite = (e) => {
    e.preventDefault();
    if (user.status) {
      navigate("/write");
    } else {
      toast.warning("Please Login to Post a Blog", {
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: false,
        pauseOnHover: true,
      });
      setTimeout(() => {
        setRedirect("/write");
        navigate("/login");
      }, 3000);
    }
  };
  const handleHome = (e) => {
    e.preventDefault();
    setCategoryPost({ status: false, category: "" });
    navigate("/");
  };

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <Navbar expand="lg">
          <Container>
            <Link className="head nav-link" onClick={handleHome}>
              Mindverse
            </Link>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="justify-content-end flex-grow-1 pe-3 nav-link"
                style={{ maxHeight: "470px" }}
                navbarScroll
              >
                <NavDropdown
                  className="nav-link"
                  title="Categories"
                  id="navbarScrollingDropdown"
                  style={{ font: "inherit", color: "black", fontSize: "1.3em" }}
                >
                  <NavDropdown.Item
                    onClick={() => {
                      setCategoryPost({ status: false, category: "" });
                      navigate("/");
                      setCount(0);
                    }}
                  >
                    All
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      setCategoryPost({ status: true, category: "Lifestyle" });
                      navigate("/");
                      setCount(0);
                    }}
                  >
                    Lifestyle
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      setCategoryPost({ status: true, category: "Technology" });
                      navigate("/");
                      setCount(0);
                    }}
                  >
                    Technology
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      setCategoryPost({
                        status: true,
                        category: "Business and finance",
                      });
                      navigate("/");
                      setCount(0);
                    }}
                  >
                    Business and finance
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      setCategoryPost({
                        status: true,
                        category: "Arts and culture",
                      });
                      navigate("/");
                      setCount(0);
                    }}
                  >
                    Arts and culture
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => {
                      setCategoryPost({
                        status: true,
                        category: "News and current events",
                      });
                      navigate("/");
                      setCount(0);
                    }}
                  >
                    News and current events
                  </NavDropdown.Item>
                </NavDropdown>
                <Navbar.Brand>
                  <Link className="link-style nav-link" onClick={handleWrite}>
                    Write
                  </Link>
                </Navbar.Brand>
                <Navbar.Brand>
                  <Link className="link-style nav-link" onClick={myPost}>
                    Mypost
                  </Link>
                </Navbar.Brand>

                {user.status ? (
                  <>
                    <Navbar.Brand>
                      <Link className="link-style-name nav-link">
                        {" "}
                        {user.name}{" "}
                      </Link>
                    </Navbar.Brand>
                  </>
                ) : (
                  <></>
                )}
                <Navbar.Brand>
                  <Link
                    className="link-style-login nav-link"
                    onClick={handleLogin}
                  >
                    {" "}
                    {user.status ? "Logout" : "Login"}{" "}
                  </Link>
                </Navbar.Brand>
              </Nav>
              <ToastContainer />
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
};
