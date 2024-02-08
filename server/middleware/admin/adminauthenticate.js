const adminDB = require("../../model/admin/adminModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "pipuldolaifghhjjk"

const adminauthenticate = async(req,res,next)=>{

    try {
        const token = req.headers.authorization;

        const tokenverify = jwt.verify(token,SECRET_KEY);
        
        const rootUser = await adminDB.findOne({_id:tokenverify._id})

        if(!rootUser){ throw new Error("user not found")}

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next()

    } catch (error) {
        res.status(400).json({error:"unauthorize no token provide"})
    }


}

module.exports = adminauthenticate;