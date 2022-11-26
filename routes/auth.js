const router = require("express").Router();
const Post = require("../models/Post")
const User = require("../models/User");

//ユーザー登録
router.post("/register", async (req, res) => {
    try{
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email, 
            password: req.body.password,
        });

        const user = await newUser.save();
        return res.status(200).json(user);
    }catch(err) {
        return res.status(500).json(err);
    }
});

//ログイン
router.post("/login", async (req,res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(!user) return res.status(404).send("ユーザーが見つかりません");
        const vailedPassword = req.body.password === user.password;
        if(!vailedPassword) return res.status(400).json("パスワードが間違っています");
        return res.status(200).json(user);

    }catch(err) {
        return res.status(500).json(err)
    }
});

//タイムライン
router.get("/timeline/all", async(req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({userId: friendId});
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
    }catch(err) {
        return res.status(500).json()
    }
})

module.exports = router;