const userDB = require("../../model/user/userModel")
const cloudinary = require("../../cloudinary/cloudinary");
const bcrypt = require("bcryptjs")  //import for cmparing hash password
const jwt = require("jsonwebtoken");
const SECRET_KEY = "pipulsolajdhbf";
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const { transporter } = require("../../helper");
const { error, info } = require("console");


//user register

exports.userRegister = async (req, res) => {

    const { firstname, lastname, email, password, conformpassword } = req.body;
    if (!firstname || !lastname || !email || !password || !conformpassword || !req.file) {
        res.status(400).json({ error: "all filled are require" })
    };
    const file = req.file?.path;
    const upload = await cloudinary.uploader.upload(file);

    try {

        const preUser = await userDB.findOne({ email: email });
        if (preUser) {
            res.status(400).json({ error: "this admin is already exist" });
        } else if (password !== conformpassword) {
            res.status(400).json({ error: "password and conformpassword are not match" });
        } else {
            const userData = new userDB(
                { firstname, lastname, email, password, conformpassword, uerprofile: upload.secure_url }
            )

            // here hashing password

            await userData.save();
            res.status(400).json(userData)
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

// user login
exports.useLogin = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "all filled require" });
    }

    try {
        const userValid = await userDB.findOne({ email: email })
        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);
            if (!isMatch) {
                res.status(400).json("invalid datails")
            } else {


                //token generate
                const token = await userValid.generateuserAuthToken();
                const result = {
                    userValid,
                    token
                }
                res.status(200).json(result);

            }
        } else {
            res.status(400).json({ error: "invalid details" })
        }

    } catch (error) {
        res.status(400).json(error)
    }

}

//user verify
exports.userVerify = async (req, res) => {
    try {
        const VerifyUser = await userDB.findOne({ _id: req.userId })
        res.status(200).json(VerifyUser)
    } catch (error) {
        res.status(400).json({ error: "invalid details" })
    }
};

// usr logout controller
exports.userLogout = async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((currentElement) => {
            return currentElement.token !== req.token
        });

        req.rootUser.save();
        res.status(200).json({ massege: "user Successfully Logout" })

    } catch (error) {
        res.status(400).json(error)
    }
}

// forgot password controller
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ error: "enter your email" })
    }
    try {
        let findUser = await userDB.findOne({ email: email });

        if (findUser) {
            //token generate for forgot password
            const token = jwt.sign({ _id: findUser._id }, SECRET_KEY, {
                expiresIn: "120s"
            })

            const setUsertoken = await userDB.findByIdAndUpdate({ _id: findUser._id }, { verifytoken: token }, { new: true })

            //join email path
            const emailTemplatepath = path.join(__dirname, "../../EmailTemplate/forgotTemplate.ejs");
            const emailTemplateread = fs.readFileSync(emailTemplatepath, "utf8");

            //set token and logo value in ejs file
            const data = {
                passwordresetlink: `http://localhost:3000/resetpassword/${findUser.id}/${setUsertoken.verifytoken}`,
                logo: "https://cdn-icons-png.flaticon.com/128/732/732200.png"
            }

            //set dynamic value in ejs
            const renderTemplate = ejs.render(emailTemplateread, data);

            //mali send
            if (setUsertoken) {
                const mailOptions = {
                    from: "pipuldolai2018@gmail.com",
                    to: email,
                    subject: "sending mail for password reset",
                    html: renderTemplate
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log("error", error);
                        res.status(400).json({ error: "Email not send" })
                    } else {
                        console.log("mail send", info.response);
                        res.status(200).json({ massege: "Email send successfully" })
                    }
                })
            }

        } else {
            res.status(400).json({ error: "user does not exist" });
        }


    } catch (error) {
        res.status(400).json(error)
    }
}

// veriforgot password
exports.forgotPasswordverify = async (req, res) => {
    const { id, token } = req.params;

    try {
        const validuser = await userDB.findOne({ _id: id, verifytoken: token });
        const verifytoken = jwt.verify(token, SECRET_KEY);  //token link expire or not

        if (validuser && verifytoken) {
            res.status(200).json({ massege: "valid user" })

        } else {
            res.status(400).json({ error: "user not exist" })
        }

    } catch (error) {
        res.status(400).json(error)
    }
}

// resetpassword
exports.resetpassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;


    try {

        const validuser = await userDB.findOne({ _id: id, verifytoken: token });
        const verifytoken = jwt.verify(token, SECRET_KEY);  //token link expire or not

        if (validuser && verifytoken) {
            const newpassword = await bcrypt.hash(password, 12);
            const resetpassword = await userDB.findByIdAndUpdate({ _id: id }, { password: newpassword }, { new: true });
            await resetpassword.save()
            res.status(200).json({ massege: "password reset successfully" })

        } else {
            res.status(400).json({ error: "link expired please create new link" })
        }

    } catch (error) {
        res.status(400).json(error)
    }
}

//getAllUser
exports.getAllUser = async (req, res) => {
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4;
    try {
        const skip = (page - 1) * ITEM_PER_PAGE;
        const count = await userDB.countDocuments();
        const pageCouct = Math.ceil(count / ITEM_PER_PAGE);

        const userdata = await userDB.find()
            .limit(ITEM_PER_PAGE)
            .skip(skip)
            .sort({ _id: -1 })

        res.status(200).json({
            pagination: {
                count, pageCouct
            },
            userdata
        })


    } catch (error) {
        res.status(400).json(error)
    }
}
//deleteUser
exports.deleteUser = async(req,res)=>{
    const{userid} = req.params;
    try {
        const deleteuserdata = await userDB.findByIdAndDelete({_id:userid})
        res.status(200).json(deleteuserdata)

    } catch (error) {
        res.status(400).json(error)
    }
}



