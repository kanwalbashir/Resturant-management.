const JWT= require('jsonwebtoken')
module.exports = async(req,res,next) => {
    try{
//get token

    const token = req.headers["authorization"]?.split(" ")[1];
    JWT.verify(token,process.env.JWT_SECRET || 'mySecretKey123',(err,decode)=>{
        if(err){
        return res.status(401).send({
        success: false,
        message: 'Unauthorize user',
        err:err.message 
        })
    }else{
       
         req.user = decode;
      next();
    }
    })
    }
    catch(error){
        console.log(error)
        res.status(500).send({
        success: false,
        message: 'Error in auth api',
        error:error.message
    });

    }
}