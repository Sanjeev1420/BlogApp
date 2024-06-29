var jwt = require("jsonwebtoken");
const con = require("../Connection/connection");
require("dotenv").config();


const GetLike=(req,res)=>
{
    const{postId}=req.body;

    const{jwt_token}=req.headers;
    try{
        const decode=jwt.verify(jwt_token,process.env.jwt_token);
        con.query(`select COUNT (*) from posts_like where postId=${postId} and userId=${decode.id}`,(err,result)=>
        {
            if(err)
            {
                console.log(err)
                res.json({result:err})
            }
            else    {
            res.json({like:result[0]["COUNT (*)"]})
            }
        })
    }
    catch(err)
    {
        console.log(err)
        res.json({status:false});
    }
}

module.exports=GetLike;