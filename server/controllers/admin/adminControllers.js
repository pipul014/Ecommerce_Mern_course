const adminDB = require("../../model/admin/adminModel");
const cloudinary = require("../../cloudinary/cloudinary");
const bcrypt = require("bcryptjs")  //import for cmparing hash password


  
// register api
exports.Register = async (req, res) => {
    
    const { name, email, mobile, password, conformpassword } = req.body;

    if (!name || !email || !mobile || !password || !conformpassword || !req.file) {
        res.status(400).json("all inputs are required")
    }

    const file = req.file?.path;
    const upload = await cloudinary.uploader.upload(file);

    try {
        const preuser = await adminDB.findOne({ email: email });
        const mobileverification = await adminDB.findOne({ mobile: mobile });

        if (preuser) {
            res.status(400).json("this admin is already exist");
        } else if (mobileverification) {
            res.status(400).json("this mobile is already exist");
        } else if (password !== conformpassword) {
            res.status(400).json("password and conformpassword not match");
        } else {
            const adminData = new adminDB({
                name, email, mobile, password, profile: upload.secure_url
            })

            // here hashing password

            await adminData.save();
            res.status(200).json(adminData);
        }


    } catch (error) {
        res.status(400).json(error)
    }

}

// login api
exports.Login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json("all field require")
    };
    try {
        const adminValid = await adminDB.findOne({ email: email });

        if (adminValid) {
            const isMatch = await bcrypt.compare(password, adminValid.password);

            if (!isMatch) {
                res.status(400).json({ error: "invalid datails" })

            } else {


                //token generate
                const token = await adminValid.generateAuthToken();
                const result = {
                    adminValid,
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

// admin verify controller
exports.AdminVerify = async (req, res) => {
    try {
        const VerifyAdmin = await adminDB.findOne({ _id: req.userId })
        res.status(200).json(VerifyAdmin)
    } catch (error) {
        res.status(400).json({ error: "invalid details" })
    }
}

// admin logout controller
exports.Logout = async (req, res) => {
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