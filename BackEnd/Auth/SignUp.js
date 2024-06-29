const cookieParser = require("cookie-parser");
const con = require("../Connection/connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmailVerification = require("./sendEmailVerification");

require("dotenv").config();

async function SendOTP(req, res) {
  const { email } = req.body;

  con.query(
    "SELECT * FROM auth WHERE email=?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        res.json({
          status: false,
          msg: "Error occurred while checking email",
        });
        return;
      }

      if (results.length === 0) {
        var t=generateOTP()
        sendEmailVerification(email, t);
        res.json({  
          otp:t,
          status: true,
          msg: "OTP sent to your email address",
        });
      } else {
        res.json({
          status: false,
          msg: "Account already exists with this email",
        });
      }
    }
  );
}

async function ResetOTP(req, res) {
  const { email } = req.body;

  con.query(
    "SELECT * FROM auth WHERE email=?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
        res.json({
          status: false,
          msg: "Error occurred while checking email",
        });
        return;
      }

      if (results.length === 1) {
        var t=generateOTP()
        sendEmailVerification(email, t);
        res.json({  
          otp:t,
          status: true,
          msg: "OTP sent to your email address",
        });
      } else {
        res.json({
          status: false,
          msg: "No account found . Try Register",
        });
      }
    }
  );
}

async function Register(req, res) {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const values = [[email, name, hashedPassword]];

  try {
    await con.query("INSERT INTO auth (email, username, password) VALUES ?", [
      values,
    ]);

    con.query("SELECT * FROM auth WHERE email=?", [email], (err, newUser) => {
      const userId = newUser[0].userid;

      const token = jwt.sign({ id: userId }, process.env.jwt_token, {
        expiresIn: "1d",
      });

      res.json({
        status: true,
        jwt: token,
  
        msg: "Registered Successfully",
        userId: userId,
      });
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      msg: "Error occurred during registration",
    });
  }
}
async function ResetPassword(req, res) {
  const { email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 1);

  try {
    await con.query(`update  auth set password ='${hashedPassword}' where email='${email}'`,);

    con.query("SELECT * FROM auth WHERE email=?", [email], (err, newUser) => {
      const userId = newUser[0].userid;

      const token = jwt.sign({ id: userId }, process.env.jwt_token, {
        expiresIn: "1d",
      });

      res.json({
        status: true,
        jwt: token,
        msg: "Reset Password Successfully",
        userId: userId,
        name:newUser[0].username
      });
    });
  } catch (err) {
    console.error(err);
    res.json({
      status: false,
      msg: "Error occurred during registration",
    });
  }
}

function generateOTP() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  SendOTP,
  Register,
  ResetPassword,ResetOTP
};
