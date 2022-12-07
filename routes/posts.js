const router = require("express").Router();
const Post = require("../models/Post");

//投稿
router.post("/", async(req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    }catch(err) {
        return res.status(500).json(err);
    }
});

//投稿を更新
router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({
              $set: req.body,
            });
            return res.status(200).json("編集に成功")
        } else {
            return res.status(403).json("あなたはほかの人の投稿を編集できません")
        }
    }catch(err) {
        return res.status(403).json(err);
    }
});

//投稿を削除
router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.deleteOne();
            return res.status(200).json("削除に成功")
        } else {
            return res.status(403).json("あなたはほかの人の投稿を削除できません")
        }
    }catch(err) {
        return res.status(403).json(err);
    }
});

//投稿を取得
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json("取得に成功")    
    }catch(err) {
        return res.status(403).json(err);
    }
});

//特定の投稿にいいね
router.put("/:id/like", async (req, res) => {
        try{
            const post = await Post.findById(req.params.id);
            if(!post.likes.includes(req.body.userId)) {
                await post.updateOne({
                    $push: {
                        likes: req.body.userId,
                    },
                });
                return res.status(200).json("いいねしました！");
            } else {
                await post.updateOne({$pull: {
                    likes: req.body.userId,
                },
            });
                return res.status(403).json("投稿からいいねを外しました");
            }
        } catch(err) {
            return res.status(500).json(err);
        }
})

module.exports = router;