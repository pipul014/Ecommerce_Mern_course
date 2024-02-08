const express = require("express");
const  router = new express.Router();
const cartscontrollers = require("../../controllers/carts/cartscontrollers");
const userauthenticate = require("../../middleware/user/userAuthenticate")

//carts route
router.post("/addtocart/:id",userauthenticate,cartscontrollers.Addtocard);
router.get("/getcarts",userauthenticate,cartscontrollers.getcartsvalue);
router.delete("/removesingleitem/:id",userauthenticate,cartscontrollers.removeSingleitem);
router.delete("/removeitems/:id",userauthenticate,cartscontrollers.removeAllitem);

//remove cart data when order done
router.delete("/removecartdata",userauthenticate, cartscontrollers.deleteCartData);



module.exports=router;