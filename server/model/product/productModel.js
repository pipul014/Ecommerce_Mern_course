const mongoose = require("mongoose");
 const productschema = new mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    productimage:{
        type:String,
        required:true
    },
    discount:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    categoryid:{
        type:String,
        required:true
    }
 },{timeseries:true});

 // models
 const productsdb = new  mongoose.model("productsmodels",productschema);
 module.exports = productsdb;