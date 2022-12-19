const router = require("express").Router();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage });
//画像アップロードAPI
router.post("/", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("成功")
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;

