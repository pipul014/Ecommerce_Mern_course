const nodemailer = require("nodemailer")
//email config
exports.transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: "pipuldolai2018@gmail.com",
        pass:"tmpldjfbwdnfgbzr"
    }
})
// tmpldjfbwdnfgbzr