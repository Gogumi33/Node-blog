// DB 스키마와 모델링
const mongoose = require("mongoose");

// 우리가 만드는 블로그에서는 관리자만 게시물작성 가능.
const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// 모델링 - PostSchema를 이용해서 post라는 모델을 만들어라.
// 실제 DB에서는 Post -> posts로 저장된다.
module.exports = mongoose.model("Post", PostSchema);