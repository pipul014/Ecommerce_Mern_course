const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "piddjbdfjchb"


// user Schema
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email")
            }
        }
    },
    uerprofile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    verifytoken:{
        type:String
    }

}, { timeseries: true });

// password hashing
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
});

// token generate
userSchema.methods.generateuserAuthToken = async function(){
    try {
        let newToken = jwt.sign({_id:this._id},SECRET_KEY,{
            expiresIn:"1d"
        });
        this.tokens = this.tokens.concat({token:newToken});

        await this.save()
        return newToken;

    } catch (error) {
        res.status(400).json({error:error})
    }
}



//user model

const userDB = new mongoose.model("usersDBs", userSchema);
module.exports = userDB;