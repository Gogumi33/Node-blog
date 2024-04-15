// 관리자 화면 라우트 코드.
const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";
// 비동기 처리 위한 핸들러 선언.
const asyncHandler = require("express-async-handler");
// DB user모델 가져오기
const User = require("../models/User");
const bcrypt = require("bcrypt"); // bcrypt 암호화 모듈 가져오기

// 관리자 페이지 [GET]
router.get("/admin", (req, res) => {
    const locals = {
        title: "관리자 페이지",
    };

    // admin 레이아웃을 이용하여 index.ejs를 표시해줘.
    res.render("admin/index", { locals, layout: adminLayout2 });
    // 🚨🚨🚨 오류났던 이유 -> res.send가 아니라 res.render로 바뀌었다 !!!
});

// 등록 폼 보여주기 [GET]
router.get("/register", asyncHandler(async (req, res) => {
    // index.ejs파일을 화면에 표시.
    res.render("admin/index", {layout: adminLayout2});
}));

// 폼에서 받은 정보 DB에 저장 [POST]
router.post("/register", asyncHandler(async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // 파싱된 data.
    const user = await User.create({
        username: req.body.username,
        password: hashedPassword
    });
    // res.json(`user created: ${user}`); // test
    
}));

module.exports = router;