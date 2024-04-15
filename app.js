// Server
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");

const app = express();
// env 파일에 포트가 지정되어 있으면 그 포트를 가져다 쓰고, 없다면 3000을 써라.
const port = process.env.PORT || 3000;

connectDb();

app.use(expressLayouts);
app.set("view engine", "ejs"); // 뷰 엔진은 ejs 쓸 거야.
app.set("views", "./views"); // 템플릿 파일은 views라는 폴더에 저장한다.


// 정적인 폴더 선언 - public 폴더 안에 정적인 파일들이 있다는 것 알려줌.
app.use(express.static("public"));

// 파싱(특정한 데이터만 추출)을 하기 위한 필수코드.
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use(cookieParser());


// 이걸 삭제하고 라우트코드에서 직접 작성하기.
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });
// 이걸 삭제하고 나면 따로 만든 main.js를 사용한다고 선언해줘야함.
app.use("/", require("./routes/main")); // 일반 사용자를 위한 라우트코드
app.use("/", require("./routes/admin")); // 관리자를 위한 라우트코드

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});