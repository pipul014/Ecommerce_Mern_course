const multer = require("multer");


// storsge config
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./useruploads")
    },
    filename: (req, file, callback) => {
        const filename = `image-${Date.now()}.${file.originalname}`
        callback(null, filename);
    }
})

// filter
const filefilter = (req, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image.jpeg") {
        callback(null, true)
    } else {
        callback(null, false);
        return callback(new Error("only png,jpg,jpeg format allow"))
    }

}

const userUpload = multer({
    storage: storage,
    filefilter: filefilter
})

module.exports = userUpload;

