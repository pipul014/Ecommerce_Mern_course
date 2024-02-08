const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    productid:{
        type:Object,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
},{timestamps:true});

// carts model 
const cartsDB = new mongoose.model("carts",cartSchema);
module.exports = cartsDB;