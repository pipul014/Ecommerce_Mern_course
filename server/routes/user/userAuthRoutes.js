const express = require("express");
const router = new express.Router();
const userUpload = require("../../multerconfig/user/userStorageConfig")
const userController = require("../../controllers/user/userControllers");
const userauthenticate = require("../../middleware/user/userAuthenticate");;
const adminAuthenticate = require("../../middleware/admin/adminauthenticate");


// user Auth routes
router.post("/register", userUpload.single("user_profile"), userController.userRegister);
router.post("/login", userController.useLogin);

router.get("/logedin",userauthenticate, userController.userVerify);
router.get("/logout",userauthenticate, userController.userLogout);

// forgot password route

router.post("/forgotpassword",userController.forgotPassword);
//forgot password verify
router.get("/forgotpassword/:id/:token",userController.forgotPasswordverify);

//resetpassword
router.put("/resetpassword/:id/:token",userController.resetpassword);

//for admin
router.get("/getAlluser",adminAuthenticate,userController.getAllUser)
router.delete("/deleteuser/:userid",adminAuthenticate,userController.deleteUser);



module.exports = router;