// 관리자 화면 라우트 코드.
const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";
const adminLayout2 = "../views/layouts/admin-nologout";
// 비동기 처리 위한 핸들러 선언.
const asyncHandler = require("express-async-handler");
// DB user모델 가져오기
const User = require("../models/User");
const Post = require("../models/Post");

const bcrypt = require("bcrypt"); // bcrypt 암호화 모듈 가져오기

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;


// 🔑 로그인 체크!!! - 요청을 서버로 보낼 때 이미 로그인이 되어 있으면 토큰도 함께 보낸다.
const checkLogin = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        res.redirect("/admin"); // 토큰 없을때는 로그인 하는 창으로 이동시킴.
    } else {
        try{
            const decoded = jwt.verify(token, jwtSecret);
            req.userId = decoded.userId;
            next(); // 토큰 있다면 next처리.
        } catch(error){
            res.redirect("/admin"); // 내가 발행한 토큰 아닐 때
        }
    }
}


// 관리자 페이지 [GET]
router.get("/admin", (req, res) => {
    const locals = {
        title: "관리자 페이지",
    };

    // admin 레이아웃을 이용하여 index.ejs를 표시해줘.
    res.render("admin/index", { locals, layout: adminLayout2 });
    // 🚨🚨🚨 오류났던 이유 -> res.send가 아니라 res.render로 바뀌었다 !!!
});


// 로그인 체크 [POST]
 router.post("/admin", asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    // User DB에서 사용자 이름을 검색한 후 나온 정보를 const user이라는 변수에 넣어둠.
    const user = await User.findOne({username});

    if(!user){
        return res.status(401).json({message: "일치하는 사용자가 없습니다!"});
    }

    // ID 파트 통과했으면 이제 비밀번호 검사 ㄱㄱ
    const isValidPassword = await bcrypt.compare(password, user.password);

    if(!isValidPassword){
        return res.status(401).json({message: "비밀번호가 일치하지 않습니다!"});
    }

    // 비밀번호 파트도 최종 통과했다면 토큰발행 ㄱㄱ
    const token = jwt.sign({id: user._id}, jwtSecret);
    res.cookie("token", token, {httpOnly: true}); // 쿠키에 토큰발행 코드
    res.redirect("/allPosts"); // 아직 생성X. 모든 게시물 보여주는 .ejs파일

 }));



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

// Post 모델에 있는 모든 데이터 가져오기 [GET] + 🔑checkLogin 추가
router.get("/allPosts", checkLogin, asyncHandler(async (req, res) => {
    const locals = {
        title: "Posts"
    };

    const data = await Post.find(); // Post라는 모델에서 모든 게시물 다 가져옴.
    res.render("admin/allPosts", { locals, data, layout: adminLayout });
}));


// 로그아웃 라우트코드
router.get("/logout", (req, res) => {
    res.clearCookie("token"); // 원래 쿠키에 저장되어있던 토큰 삭제.
    res.redirect("/"); // 로그인 이전 화면으로 돌아감.
});


// 여기서부터 로그인 후 작업
// 게시물 추가 [GET] + 🔑checkLogin 추가
router.get("/add", checkLogin, asyncHandler(async (req, res) => {
    const locals = {
        title: "게시물 작성"
    };
    // 제목을 표시하기 위해 locals도 같이 넘겨줌.
    res.render("admin/add", { locals, layout: adminLayout });
}));
// 게시물 추가 [POST] + 🔑checkLogin 추가
router.post("/add", checkLogin, asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const newPost = new Post({
        title: title,
        body: body,
    });

    await Post.create(newPost); // Post 모델에 newPost 추가.
    res.redirect("/allPosts");
}));

// 게시물 수정 [GET] + 🔑checkLogin 추가
router.get("/edit/:id", checkLogin, asyncHandler(async (req, res) => {
    const locals = {
        title: "게시물 수정"
    };
    const data = await Post.findOne({_id: req.params.id});

    res.render("admin/edit", { locals, data, layout: adminLayout });
}));
// 게시물 수정 [PUT] + 🔑checkLogin 추가
router.put("/edit/:id", checkLogin, asyncHandler(async (req, res) => {
    // id값을 찾고 수정까지 한꺼번에!
    await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        createdAt: Date.now()
    })
    res.redirect("/allPosts");
}));

// 게시물 삭제 (라스트) + 🔑checkLogin 추가
router.delete("/delete/:id", checkLogin, asyncHandler(async (req, res) => {
    await Post.deleteOne({_id: req.params.id});
    res.redirect("/allPosts");
}));


module.exports = router;