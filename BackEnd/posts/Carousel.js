const con = require("../Connection/connection")

const Carousel=(req,res)=>
{
    try{
        con.query("select * from posts ORDER BY RAND() LIMIT 4",(err,result)=>
        {
            if(err)
                res.json({msg:err});
            else
            {
                res.json({data:result});
            }    
        })
    }
    catch(err)
    {
        res.json({msg:err});
    }
}
module.exports=Carousel;