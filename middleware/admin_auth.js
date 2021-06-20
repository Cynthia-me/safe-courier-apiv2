const jwt = require('jsonwebtoken');

module.exports = function (req,res,next){
    const swagger = req.header("authorization")
    const token = req.header('admin-token');
    if(swagger){
        swagger = swagger.split("")[1]
    }
    if(!token && !swagger) {
        res.status(401).json({ 
            message : "Access denied"
        })
    }
    try{
        if(!token && swagger){
            const key = swagger
            const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.admin = verified;
        return next()
        }
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.admin = verified;
        next()
    }
    catch(err){
        res.status(401).json({
            message : "Invalid token"
        })
        console.log(err)
    }
    
}


