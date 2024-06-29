const { jwt } = require("jsonwebtoken");
const con = require("../Connection/connection");
require("dotenv").config();


const Likes=(req,res)=>
{
    const{postId}=req.body;

    
    try{
        con.query(`select COUNT (*) from posts_like where postId=${postId}`,(err,result)=>
        {
            if(err)
            {
                console.log(err)
                res.json({result:err})
            }
            else    {
            res.json({like:result[0]["COUNT (*)"],"dk":"kk"})
            }
        })
    }
    catch(err)
    {
        console.log(err)
        res.json({status:false});
    }
}

module.exports=Likes;