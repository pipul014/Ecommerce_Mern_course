const userDB = require("../../model/user/userModel");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "piddjbdfjchb"

const userauthenticate = async(req,res,next)=>{

    try {
        const token = req.headers.authorization;

        const tokenverify = jwt.verify(token,SECRET_KEY);
        
        const rootUser = await userDB.findOne({_id:tokenverify._id})

        if(!rootUser){ throw new Error("user not found")}

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id
        req.userMainId = rootUser.id    //rootuser in string for match with carts userid because siring to string match 

        next()

    } catch (error) {
        res.status(400).json({error:"unauthorize no token provide"})
    }
}

module.exports = userauthenticate;