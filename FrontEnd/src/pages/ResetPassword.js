import axios from "../axios/Axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Auth, jsonwebtoken, Load, Redirect } from "../Atom/Atom";
import { useNavigate } from "react-router-dom";
import "../stylesheet/Register.scss";
import { Col, Container, Row } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(Auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jwt, setJwt] = useRecoilState(jsonwebtoken);
  const [loading, setLoading] = useRecoilState(Load);
  const redirect = useRecoilValue(Redirect);
  const [otp, setOtp] = useState(false);
  const [otpcode, setOtpcode] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [showpassword, setShowpassword] = useState(false);
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);
  const checkPasswordStrength = () => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (regex.test(password)) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpcode == enteredOtp) {
      try {
        setLoading(true);
        const result = await axios.post(
          "/resetpassword",
          {
            email: email,
            password: password,
          }
        );
        setLoading(false);
        if (result.data.status) {
          setJwt(result.data.jwt);
          localStorage.setItem("jwt", result.data.jwt);
          setUser({ status: true, name: result.data.name});

          toast.success(`Signed in as ${result.data.name}`, {
            position: toast.POSITION.TOP_RIGHT,
            closeOnClick: false,
            pauseOnHover: true,
          });
          setTimeout(() => {
            navigate(redirect);
          }, 5000);
        } else {
          toast.error(result.data.msg, {
            position: toast.POSITION.TOP_RIGHT,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.error(`Otp does not match`, {
        position: toast.POSITION.TOP_RIGHT,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const handleGetOtp = async (e) => {
    setTimeRemaining(120);
    e.preventDefault();
    try {
      const result = await axios.post("/resetotp", {
        email: email,
      });
      if (result.data.status) {
        toast.success(result.data.msg);
        setOtpcode(result.data.otp);
        setOtp(true);
      } else {
        toast.info("Account Not Found Try Register");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isDisabled =
    !checkPasswordStrength() ||
    !user.name ||
    !email ||
    !password ||
    enteredOtp.length !== 6;

  return (
    <>
      <ToastContainer />
      {loading ? (
        <></>
      ) : (
        <Container>
          <Row>
            <Col lg={3} xs={0}></Col>
            <Col lg={6} xs={12}>
              <div className="auth">
                <h1>Reset Password</h1>
                <form>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the Email"
                    disabled={otp}
                  />
                  <input
                    type="number"
                    className="form-control"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter the OTP"
                  />
                  <input
                    type={showpassword ? "text" : "password"}
                    value={password}
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter the new Password"
                  />
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckIndeterminate"
                      checked={showpassword}
                      onChange={() => setShowpassword(!showpassword)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckIndeterminate"
                    >
                      Show Password
                    </label>
                  </div>
                  {password && !checkPasswordStrength() && (
                      <div className="password-strength">Password is Weak.Must Contain UpperCase,LowerCase,Special Characters,Numbers and length more than 7</div>
                    )}
                  {!otp ? (
                    <button disabled={!email} onClick={handleGetOtp} className="btn btn-danger">
                      Get OTP
                    </button>
                  ) : (
                    <>
                      <button
                        disabled={
                          !email ||
                          !password ||
                          !enteredOtp ||
                          !checkPasswordStrength(password)
                        }
                        onClick={handleSubmit}
                        className="btn btn-danger"
                      >
                        Reset
                      </button>
                    </>
                  )}
                </form>
              </div>
            </Col>
            <Col md={6} xs={0}></Col>
          </Row>
        </Container>
      )}
    </>
  );
};
