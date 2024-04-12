// 메인 라우트 코드
const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";

// "/"일때, "/home"일때 둘 다 렌더링 똑같이 해 줌.
router.get(["/", "/home"], (req, res) => {
    const locals = {
        title: "Home"
    }

    // 이제 렌더링을 해 줄 것임.
    // home이라는 경로로 GET 요청이 들어왔을 때 "index.js" 표시한다.
    // 또한 locals 정보와 메인 레이아웃을 넘겨줄거야.
    res.render("index", { locals, layout: mainLayout });
});

router.get("/about", (req, res) => {
    const locals = {
        title: "About"
    }

    // about이라는 경로로 GET 요청? "about.js" 표시.
    res.render("about", { locals, layout: mainLayout });
});

module.exports = router;