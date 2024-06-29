var jwt = require("jsonwebtoken");
const con = require("../Connection/connection");
require("dotenv").config();
const Suggestion = async (req, res) => {
  try {
    await jwt.verify(
      req.body.jwt,
      process.env.jwt_token,
      (err, decode) => {
        var id=decode.id;
        if(err)
            console.log(err)
        else
        {
            var q=`insert into suggestions (uid,suggestions) values ?`;
            const{suggestions}=req.body;
            var values=[[id,suggestions]]
            con.query(q,[values],(e,result,fields)=>
            {
                if(e)
                {
                    console.log(e);
                    res.send({status:false})
                }
                else
                {
                    res.send({status:true});
                }
            });
        }    
      }
    );
  } catch (error) {
    console.log(error);
  }
};
module.exports=Suggestion;