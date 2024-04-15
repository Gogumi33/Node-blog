// DB 스키마와 모델링 - 관리자 또는 사용자
const mongoose = require("mongoose");

// 사용자 이름과 비밀번호만 있으면 된다.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("User", userSchema);