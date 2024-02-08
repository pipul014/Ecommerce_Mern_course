const express = require("express");
const router = new express.Router();

const adminauthenticate = require("../../middleware/admin/adminauthenticate");
const productcontroller = require("../../controllers/product/productconrtoller");
const productupload = require("../../multerconfig/products/productStorageConfig");
const userAuthenticate = require("../../middleware/user/userAuthenticate")

// products category routes
router.post("/addcategory",adminauthenticate,productcontroller.AddCategory);
router.get("/getcategory",productcontroller.Getcategory);

// products routes
router.post("/addproduct",[adminauthenticate,productupload.single("productimage")],productcontroller.Addproduct);
router.get("/getproducts",productcontroller.GetAllProducts);
router.get("/getsingleproduct/:productid",productcontroller.getSingleProduct);
router.delete("/product/:productid",adminauthenticate,productcontroller.deleteProducts);

// new arival products
router.get("/getletestproducts",productcontroller.getLetestProducts);

//product review api
router.post("/productreview/:productid",userAuthenticate,productcontroller.productReviews)
router.get("/getproductreview/:productid",productcontroller.getProductReviews)
router.delete("/productreviewdelete/:reviewid",userAuthenticate, productcontroller.deleteProductReviews)

module.exports = router;