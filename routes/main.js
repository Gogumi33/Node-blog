// 메인 라우트 코드
const express = require("express");
const router = express.Router();
const mainLayout = "../views/layouts/main.ejs";
const Post = require("../models/Post");
// 비동기 처리 위해 asyncHandler 가져오기.
const asyncHandler = require("express-async-handler");

// "/"일때, "/home"일때 둘 다 렌더링 똑같이 해 줌.
router.get(["/", "/home"], asyncHandler( async (req, res) => {
    const locals = {
        title: "Home"
    };
    const data = await Post.find(); // DB의 POST에 있는 모든 게시물 다 가져오기.

    // 이제 렌더링을 해 줄 것임.
    // home이라는 경로로 GET 요청이 들어왔을 때 "index.js" 표시한다.
    // 또한 locals 정보와 메인 레이아웃을 넘겨줄거야.
    res.render("index", { locals, data, layout: mainLayout });
}));

router.get("/about", (req, res) => {
    const locals = {
        title: "About"
    }

    // about이라는 경로로 GET 요청? "about.js" 표시.
    res.render("about", { locals, layout: mainLayout });
});

// 해당 게시물 상세보기 [GET]
// post값으로 id를 같이 넘겨주게 되면, db에서 해당자료 찾아와 data로 할당해라
// 받아온 data는 post.ejs로 렌더링해라.
router.get(
    "/post/:id",
    asyncHandler(async (req, res) => {
        const data = await Post.findOne({ _id: req.params.id });
        res.render("post", { data, layout: mainLayout});
    })
);

module.exports = router;

// Post라는 모델에 임시게시물 만들기.
// Post.insertMany([
//     {
//         title: "제목 1",
//         body: "내용 1 - 여기는 블로그 내용이 들어갈 자리입니다."
//     },
//     {
//         title: "제목 2",
//         body: "내용 2 - 여기는 블로그 내용이 들어갈 자리입니다."
//     },
//     {
//         title: "제목 3",
//         body: "내용 3 - 여기는 블로그 내용이 들어갈 자리입니다."
//     },
//     {
//         title: "제목 4",
//         body: "내용 4 - 여기는 블로그 내용이 들어갈 자리입니다."
//     },
//     {
//         title: "제목 5",
//         body: "내용 5 - 여기는 블로그 내용이 들어갈 자리입니다."
//     },
// ]); // 여러개 생성 -> 배열형태.
