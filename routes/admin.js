// 관리자 화면 라우트 코드.
const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";

// 관리자 페이지 [GET]
router.get("/admin", (req, res) => {
    const locals = {
        title: "관리자 페이지",
    };

    // admin 레이아웃을 이용하여 index.ejs를 표시해줘.
    res.render("admin/index", { locals, layout: adminLayout2 });
    // 🚨🚨🚨 오류났던 이유 -> res.send가 아니라 res.render로 바뀌었다 !!!
});

module.exports = router;