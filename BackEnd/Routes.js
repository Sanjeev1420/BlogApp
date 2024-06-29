const express = require("express");
const Login = require("./Auth/Login");
const Posts = require("./posts/Posts");
const CreatePost = require("./posts/CreatePost");
const Verify = require("./Auth/Verify");
const Suggestion = require("./suggestions/Suggestions");
const Delete = require("./posts/Delete");
const Likes = require("./posts/Likes");
const GetLike = require("./posts/GetLike");
const Like = require("./posts/Like");
const Unlike = require("./posts/Unlike");
const UploadImage = require("./posts/UploadImage");
const {SendOTP, Register, ResetPassword, ResetOTP} = require("./Auth/SignUp"); // Import the SendOTP function
const Carousel = require("./posts/Carousel");
const { Addcomment, GetComments, AllComments, EditComment, DeleteComment } = require("./posts/Comments");
const EditPost = require("./posts/EditPost");
const routers = express.Router();

routers.route("/login").post(Login);
routers.route("/posts").post(Posts);
routers.route("/addposts").post(CreatePost);
routers.route("/verify").post(Verify);
routers.route("/suggestions").post(Suggestion);
routers.route("/delete").post(Delete);
routers.route("/like").post(Likes);
routers.route("/getlike").post(GetLike);
routers.route("/unlike").post(Unlike);
routers.route("/putlike").post(Like);
routers.route("/uploadimage").post(UploadImage);
routers.route("/sendotp").post(SendOTP); // Add the route for sendotp and associate it with SendOTP function
routers.route("/register").post(Register);
routers.route("/resetpassword").post(ResetPassword)
routers.route("/resetotp").post(ResetOTP)
routers.route("/carousel").get(Carousel);
routers.route("/addcomment").post(Addcomment)
routers.route("/getcomment").post(GetComments);
routers.route("/allcomments").post(AllComments);
routers.route("/editcomment").post(EditComment);
routers.route("/deletecomment").post(DeleteComment)
routers.route("/edit").post(EditPost)
module.exports = routers;
