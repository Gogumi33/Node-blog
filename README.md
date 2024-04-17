# Node.js 마지막주차 프로젝트
# 나만의 블로그 만들어보기

## 초반 환경설정
1. `npm init -y` 로 초기화
2. 익스프레스 프레임워크와 .env를 위한 모듈 설치
`npm i express dotenv`
3. 간단히 서버 만들기 - app.js파일 생성
```
// Server
require("dotenv").config();
const express = require("express");

const app = express();
// env 파일에 포트가 지정되어 있으면 그 포트를 가져다 쓰고, 없다면 3000을 써라.
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
```
4. 위 app.js 코드에서 app.get() 은 따로 메인 라우트 코드를 작성하여 빼주자.
routes 폴더를 만들고 이 안에 main.js파일 생성.
```
// 메인 라우트 코드
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World!");
});

module.exports = router;
```

5. 이 따로만든 라우트 파일을 사용하기 위해 app.js의app.get()함수 자리에 app.use()로 가져오기
```
// 이걸 삭제하고 라우트코드에서 직접 작성하기.
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });
// 이걸 삭제하고 나면 따로 만든 main.js를 사용한다고 선언해줘야함.
app.use("/", require("./routes/main"));
```

기초 환경설정은 마무리.

---

## 필요한 폴더 구성
![](https://velog.velcdn.com/images/king33/post/43932875-5c7a-4d6b-a8f3-5b8004a94fdc/image.PNG)

### 루트 폴더에 🧧[config / models / public / views] 폴더를 순서대로 생성한다.

---

## 기본 레이아웃(틀) 만들기
앞서 했던 연락처는 헤더와 푸터를 이용하여 틀을 미리 만들었지만, 이번 프로젝트는 <span style="color:purple">레이아웃 파일</span>을 이용한다.
(일반 사용자가 보는 레이아웃 / 관리자 전용 레이아웃)

이를 이용하기 위해 ejs에 필요한 모듈과 레이아웃 모듈도 설치
* `npm i ejs`
* `npm i express-ejs-layouts`

다운로드를 완료하였다면 app.js로 돌아와 선언해주기
```
const expressLayouts = require("express-ejs-layouts");

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", "./views");
```

### 레이아웃 ejs파일을 만들어보자
views폴더에 layouts라는 폴더를 하나 더 만들어주고, 그 안에 main.ejs를 생성한다.
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gogumi Blog</title>
</head>
<body>
    <!-- 이 ejs 태그가 있는 부분만 변경되는 내용이 표시된다. -->
    <%- body %>
</body>
</html>
```
-> 저 `<%- body %>` 부분에 따로 만들어준 ejs파일을 불러와 <span style="color:skyblue">리액트 컴포넌트</span> 방식으로 바꿔치기 해 주는 방식이다.

* index.ejs - `<h1>Home</h1>`
* about.ejs - `<h1>About</h1>`

이후, main.js에서 메인 레이아웃을 선언 후 각 경로에 따른 라우터 방법을 알려주는 코드를 작성해준다.
```
const mainLayout = "../views/layouts/main.ejs";

router.get("/home", (req, res) => {
    // res.send("Hello World!");

    // 이제 렌더링을 해 줄 것임.
    // home이라는 경로로 GET 요청이 들어왔을 때 "index.js" 표시한다.
    res.render("index", {layout: mainLayout});
});

    // about이라는 경로로 GET 요청? "about.js" 표시.
router.get("/about", (req, res) => {
    res.render("about", {layout: mainLayout});
});
```

---

## Title 도 동적으로 설정하기
![](https://velog.velcdn.com/images/king33/post/8cc1cdbc-a820-49d6-9326-64747dcff53b/image.PNG)

위 그림의 🌎 맨 위 지구모양 부분의 텍스트를 Title이라고 하는데, 이 부분도 동적으로 페이지마다 원하는 텍스트를 가져올 수 있다.

우선, main.ejs의 `<head></head>` 부분에 있는 title 부분을 ejs문법을 이용하여 고쳐준다.
```
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= locals.title %></title>
</head>
```

그런다음 main.js에서는 render()함수를 쓸 때 mainLayout과 함께 객체를 같이 넘겨주면 된다!
```
router.get("/about", (req, res) => {
    const locals = {
        title: "About"
    }

    // about이라는 경로로 GET 요청? "about.js" 표시.
    res.render("about", { locals, layout: mainLayout });
});
```

---

## 블로그 첫 화면 구성
메인 레이아웃(네비게이션 바)과 제일 처음 보여질 화면인 index.ejs는 미리 준비된 파일을 가져왔다.

<main.ejs>
```
<!-- 메인 레이아웃 (네비게이션 바 느낌) -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= locals.title %></title>
  <meta name="description" content="My first application using Node.js, Express and MongoDB">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  
  <div class="container">   

    <!-- 헤더 : 로고, 상단 메뉴, 로그인 -->
    <header class="header">
      <!-- 로고 -->
      <a href="/" class="header-logo">Gogumi's Blog</a>

      <!-- 상단 메뉴 -->
      <nav class="header-nav">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </nav>

      <!-- 관리자 로그인 -->
      <div class="header-button">
        <a href="#">관리자 로그인</a>
      </div>
    </header>

    <!-- 메인 : 실제 내용이 들어갈 부분 -->    
    <main class="main">
      <%- body %>
    </main>
  </div>  

</body>
</html>
```

<index.ejs>
```
<!-- '/'루트 경로나 '/home'경로일 경우 보여주는 제일 첫 페이지 -->
      <!-- 상단 소개글, 히어로 이미지 -->
      <div class="top">
        <h1 class="top-heading">하루하루 스터디</h1>
        <p class="top-body">매일 1시간씩 공부한 내용을 기록하고 있습니다.</p>
      </div>

      <img src="/img/top-hero.jpg" alt="노트에 기록하는 모습" class="hero-image" width="840" height="400">

      <!-- 최근 게시물 -->
      <section class="articles">
        <h2 class="articles-heading">최근 게시물</h2>
        <ul class="article-ul">
            <li>
              <a href="#">
                <span>Title 1</span>
                <span class="article-list-date">2023.01.01</span>
              </a>
            </li>
        </ul>
      </section>
```

### 정적인 파일들
이후 이 파일들에 대한 css파일과 이미지 파일도 그대로 복사하여 미리 만들어두었던 public에 그대로 복사하여 주고, app.js에 정적인 파일들만 모아둔 곳을 사용하라는 선언을 해 준다.
```
// 정적인 폴더 선언 - public 폴더 안에 정적인 파일들이 있다는 것 알려줌.
app.use(express.static("public"));
```

---

## MongoDB 재연결
앞서 사용했던 연락처 프로젝트의 DB를 그대로 사용한다.
VS Code에서의 MongoDB는 한 번 사용했던 DB를 다시 연결하는 게 매우 수월하다.

MongoDB 탭에 들어가서 원래 사용했던 데이터베이스에 오른쪽 마우스 클릭 후 'copy connection string'을 누른 뒤 루트 폴더에 .env파일 생성 후 여기에 그대로 복사하여 저장해둔다.

🚨 하지만, 저번에 설치했던 DB관련 모듈들은 다시 설치해 주어야 한다..
* 몽구스 모듈
* async-handler 모듈
```
npm i mongoose express-async-handler
```

모듈 설치 후 config폴더에 db.js를 만들고 다음과 같이 작성한다.
```
// env 파일에 저장된 db URI를 가져와 그 경로로 접속하도록 한다.
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const connectDb = asyncHandler(async () => {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`DB Connected: ${connect.connection.host}`);
});

module.exports = connectDb;
```

이제 app.js로 와서 위 파일을 가져오고, connectDB()를 이용하여 연결만 해 주면 끝이다.
```
const connectDb = require("./config/db");

connectDb();
```


![](https://velog.velcdn.com/images/king33/post/8bad6d76-37b0-4db4-9477-096ee5ca6c8c/image.PNG)

-> 터미널을 통해 잘 연결된 것을 확인할 수 있다.

---

## DB 스키마 만들기
이제 models폴더에 post.js파일을 만들고, 스키마의 구조를 정의한 다음 모델링까지 진행한다.
```
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
moule.exports = mongoose.model("Post", PostSchema);
```
이후 main.js로 돌아와 Post.insertMany() 함수를 통해 임시 게시물을 몇 개 만들어주면 MongoDB 탭에 만들어두었던 스키마가 모델링 되면서 myBlog라는 DB칸이 생성된다.
```
Post.insertMany([
    {
        title: "제목 1",
        body: "내용 1 - 여기는 블로그 내용이 들어갈 자리입니다."
    },
    {
        title: "제목 2",
        body: "내용 2 - 여기는 블로그 내용이 들어갈 자리입니다."
    },
    {
        title: "제목 3",
        body: "내용 3 - 여기는 블로그 내용이 들어갈 자리입니다."
    },
    {
        title: "제목 4",
        body: "내용 4 - 여기는 블로그 내용이 들어갈 자리입니다."
    },
    {
        title: "제목 5",
        body: "내용 5 - 여기는 블로그 내용이 들어갈 자리입니다."
    },
]); // 여러개 생성 -> 배열형태.
```

---

## 저장된 데이터 가져오기
main.js에서 원래 router.get(["/", "/home"]) 함수에 비동기처리를 위해 asyncHander를 추가해준다.
```
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
```
-> 또한 index.ejs로 DB에서 가져온 data정보를 render()의 매개변수를 통해 싹 다 넘겨준다.

이제 index.ejs에 넘겨준 것을 렌더시켜주기만 하면 끝이다.
```
      <!-- 최근 게시물 -->
      <section class="articles">
        <h2 class="articles-heading">최근 게시물</h2>
        <ul class="article-ul">
          
          <!-- forEach를 통해 게시물 전체 순회 -->
          <% data.forEach( post => { %>
            <li>
              <a href="#">
                <span><%= post.title %></span>
                <!-- 날짜와 시간이 모두 들어있는데, 우리는 날짜만 필요하다. -->
                <span class="article-list-date"><%= post.createdAt.toDateString() %></span>
              </a>
            </li>
          <% }) %>
        </ul>
      </section>
```
### 🎊 여기까지 했다면 블로그에 임시 게시물이 잘 보이는 것을 확인할 수 있다.

---

## 실제 게시물 내용 보이기
게시물의 각각의 내용을 보여주기 위해서는 파라미터 id값을 가져와 해당 게시물만 가져오면 된다.

main.js에 컨트롤러 함수를 하나 추가해준다.
```
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
```

이후 post.ejs만 만들고 해당 게시물 눌렀을 때 이 파일로 링크만 시켜주면 된다.
```
<!-- 개별 게시물 보여주는 ejs파일 : 게시물제목 + 내용 -->
<h1><%= data.title %></h1>
<article class="article">
    <%= data.body %>
</article>

<!-- 이제 게시물 클릭했을 때 이 파일 링크만 해주면 OK -->
```

위 index.ejs의 forEach문에 있는 href에 이렇게 작성해준다.
```
<a href="/post/<%= post._id %>">
```

![](https://velog.velcdn.com/images/king33/post/b36930f4-fc29-4df9-9061-4fab813c8a6b/image.PNG)
잘 나온다! 😉


---


# 나만의 블로그 - 관리자 전용 페이지
![](https://velog.velcdn.com/images/king33/post/3e719f0f-9054-471c-ab5f-16f01a545e8d/image.PNG)
내가 만들 블로그에서는 오직 <span style="color:gold">관리자</span>만이 새로운 게시글을 작성하고 수정/삭제 할 수 있다.

따라서 이번에는 관리자에 관련된 모든 페이지들을 만들어보자.

## 관리자 로그인

먼저 main.ejs에 적어뒀던 파일을 그대로 복사하여 같은 layouts폴더에 admin.ejs라는 파일을 만든 뒤 '관리자 로그인' 부분만 '로그아웃'으로 변경하여 코드를 붙여넣기 해준다.
```
<!-- 관리자 전용 페이지ejs. 관리자만 게시글을 만들고 삭제할 수 있다. -->
<!-- 메인 레이아웃 (네비게이션 바 느낌) -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= locals.title %></title>
  <meta name="description" content="My first application using Node.js, Express and MongoDB">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  
  <div class="container">   

    <!-- 헤더 : 로고, 상단 메뉴, 로그인 -->
    <header class="header">
      <!-- 로고 -->
      <a href="/" class="header-logo">Admin Page</a>

      <!-- 상단 메뉴 -->
      <nav class="header-nav">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </nav>

      <!-- 관리자 로그아웃 -->
      <div class="header-button">
        <a href="#">관리자 로그아웃</a>
      </div>
    </header>

    <!-- 메인 : 실제 내용이 들어갈 부분 -->    
    <main class="main">
      <%- body %>
    </main>
  </div>  

</body>
</html>
```

그런다음, ejs파일을 만들었다면 자연스럽게 라우트 코드 만들 생각을 하고 있어야 한다. routes폴더에 관리자 화면 라우트코드를 작성할 admin.js파일을 만들고 아래와 같은 코드를 작성한다.

```
// 관리자 화면 라우트 코드.
const express = require("express");
const router = express.Router();
const adminLayout = "../views/layouts/admin";

// 관리자 페이지 [GET]
router.get("/admin", (req, res) => {
    const locals = {
        title: "관리자 페이지",
    };

    // admin 레이아웃을 이용하여 index.ejs를 표시해줘.
    res.render("admin/index", { locals, layout: adminLayout });
    // 🚨🚨🚨 오류났던 이유 -> res.send가 아니라 res.render로 바뀌었다 !!!
});

module.exports = router;
```

이제 라우트 코드를 완성했다면 또 자연스럽게 app.js에 나 이제 이걸 쓸 것이라고 알려주어야 한다.

원래 적어두었던 일반 사용자를 위한 라우트코드 밑에 고스란히 `app.use("/", require("./routes/admin"));` 를 추가해주자.

가만히 생각해보면 관리자 화면이 나오기 위해서는 관리자 로그인이 완료되어야 진행할 수 있으므로 이제 로그인 폼을 간단히 만든 뒤 연결시켜준다.

views 폴더 -> admin 폴더를 새로 만들고 여기에 index.ejs파일을 하나 만들어준다.
**(이는 admin으로 요청이 왔을 때 제일 먼저 보여줄 첫 번째 화면)**

```
<!-- admin으로 요청이 왔을 때 나타나는 첫 화면. -->
<h3>로그인</h3>
<form action="/admin" method="POST">
    <label for="username"><b>사용자 이름</b></label>
    <input type="text" name="username" id="username">

    <label for="password"><b>비밀번호</b></label>
    <input type="password" name="password" id="password">

    <input type="submit" value="로그인" class="btn">
</form>
```

만들었다면, admin.js에 `const adminLayout = "../views/layouts/admin";` 로 불러온 뒤, res.render에 객체로 같이 낑겨서 잘 넘겨준다.

---

## 로그인 유무에 따른 레이아웃 버튼

* 로그인이 안 되어있을 시? '로그아웃' 버튼 안 보이게
* 로그인이 되어있는 상태라면? '로그아웃' 버튼 존재

>원래는 <span style="color:skyblue">로그인 유무</span> 를 저장해놓는 전역변수를 하나 선언해놓고, 로그인 상태에 따라 '삼항연산자'를 이용해서 구현할 수도 있지만 이번에는 layout을 2개 만들어서 상황에 따라 서로다른 레이아웃을 보여주는 방식으로 구현한다.

<admin-nologout.ejs 코드>
```
<!-- 관리자 전용 레이아웃ejs. 관리자만 게시글을 만들고 삭제할 수 있다. -->
<!-- 메인 레이아웃 (네비게이션 바 느낌) -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= locals.title %></title>
  <meta name="description" content="My first application using Node.js, Express and MongoDB">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  
  <div class="container">   

    <!-- 헤더 : 로고, 상단 메뉴, 로그인 -->
    <header class="header">
      <!-- 로고 -->
      <a href="/" class="header-logo">Admin Page</a>

      <!-- 상단 메뉴 -->
      <nav class="header-nav">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </nav>

    <!-- 메인 : 실제 내용이 들어갈 부분 -->    
    <main class="main">
      <%- body %>
    </main>
  </div>  

</body>
</html>
```
-> 관리자 로그아웃 부분만 싹 빼고 레이아웃을 하나 더 만든 셈이다.

---

## 🎓관리자 정보 DB에 추가
이제 할 것은 로그인 폼에 관리자 ID/PW를 입력하면 로그인이 되게 하는 것이다.

그렇다면 '관리자 등록을 위한 폼'이 필요하다.

관리자는 단 1명만 있으면 되기 때문에, 간단하게 구현하고 DB에 등록이 완료된다면 이 폼은 삭제되도록 해보자.

index.ejs의 원래 코드 밑에 요걸 그대로 넣어준다.
```
<!-- admin으로 요청이 왔을 때 나타나는 첫 화면. -->
<h3>관리자 등록</h3>
<form action="/register" method="POST">
    <label for="username"><b>사용자 이름</b></label>
    <input type="text" name="username" id="username">

    <label for="password"><b>비밀번호</b></label>
    <input type="password" name="password" id="password">

    <input type="submit" value="등록" class="btn">
</form>
```

다음은 이에 대한 라우트 코드 작성을 해주어야 하므로 admin.js파일로 와서 밑에 코드를 더 넣어준다.
```
// 등록 폼 보여주기 [GET]
router.get("/register", asyncHandler(async (req, res) => {
    // index.ejs파일을 화면에 표시.
    res.render("admin/index", {layout: adminLayout2});
}));

// 폼에서 받은 정보 DB에 저장 [POST]
router.post("/register", asyncHandler(async ( req, res) => {
    res.send("Register");
}));
```

관리자 또는 사용자를 등록해야하므로 DB의 새로운 모델이 필요하다. models폴더에 User.js를 만들고 모델링을 진행한다.
```
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
```

이후 admin.js에서 이를 가져오겠다고 선언해준다.
`const User = require("../models/User");`

## 암호화 모듈 설치 - bcrypt
앞서 진행했었던 비크립트 해시함수 암호화 모듈을 이 프로젝트에서도 똑같이 설치해준다.
`npm i bcrypt`

이 또한 admin.js에 가져오겠다고 똑같이 선언
`const bcrypt = require("bcrypt");`

### ⭐여기서 잠깐, <span style="color:red">파싱</span>이란?
>-> <span style="color:green">어떤 거대한 자료에서 원하는 자료만 가공하고 뽑아 원하는 때에 불러올 수 있게 하는것을 의미한다.</span>

* 파서? 파싱을 수행하는 프로그램을 지칭.

이게 여기서 왜 필요하냐?! Admin Page의 등록 폼에서 입력한 정보들이 요청 본문`req.body`에 담기게 되는데, 여기에 담긴 값을 프로그램에 사용할 수 있도록 파싱해주는 미들웨어가 필요하다.

즉, URL에 담겨서 가게 되는 여러가지 요청 본문을 파싱한다.

app.js에 아래 코드를 추가해주자.
```
// 파싱(특정한 데이터만 추출)을 하기 위한 필수코드.
app.use(express.json());
app.use(express.urlencoded({extended: true}));
```

이제 다시 admin.js의 router.post() 부분을 수정한다.
```
router.post("/register", asyncHandler(async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // 파싱된 data.
    const user = await User.create({
        username: req.body.username,
        password: hashedPassword
    });
    res.json(`user created: ${user}`); // test
}));
```

---

## 로그인 처리하기

### 사용자 인증 다시 개념정리
로그인을 처리하기 위해 **json web token**을 이용한다. 이는 로그인한 사용자 정보가 DB에 있는지 확인하고, 사용자가 맞다면 서버->클라이언트로 토큰을 보내주는 것이다.

![](https://velog.velcdn.com/images/king33/post/c92ebcae-11e4-4223-ac54-b91916f50257/image.PNG)

이 토큰은 웹브라우저의 '쿠키'에 저장되고, 로그인을 해야만 진행가능한 요청들을 사용하게 될 경우에 이 저장된 토큰을 같이 첨부하여 서버로 보낸다. 서버에서는 이 토큰이 내가 발행해준 토큰인지 확인 한번 해 주고, 맞다면 로그인이 필요한 기능을 사용하게 해 주는 것이다.

개발에 필요한 모듈 2가지
* cookie-parser
* jsonwebtoken

`npm i cookie-parser jsonwebtoken`으로 설치해준다.

이제 또 app.js로 와서 미들웨어로 등록한다.
```
const cookieParser = require("cookie-parser");

app.use(cookieParser);
```

다음은 JSON Web Token을 사용하기 위해 .env파일에 비밀키를 지정해준다.
`JWT_SECRET = mycode`
자신이 원하는 아무 문자열로 정한 뒤, admin.js로 와서 라우트코드에 이용한다.

```
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
```

admin.js로 돌아와서 POST를 이용한 로그인체크 코드를 작성한다.
```
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
    res.cookie("token", token, {httpOnly: true}); // 토큰발행 코드
    res.redirect("/allPosts");

 }));
 ```
 
 ### 🚨여기서 매우 간단한 에러발생
 ![](https://velog.velcdn.com/images/king33/post/dac18589-6c67-4f27-b3b7-876aa7f8b04f/image.PNG)

-> 위 app.js에서 cookieParser() 의 괄호 안썼다구 localhost:3000에서 무한로딩 에러의 벽을 약 30분간 경험하였다.
(6년전에 이 에러를 겪으신분께 감사드립니다 ><)

---

## 로그인 후 전체 게시물 표시

admin.js에 아래 코드 작성.
```
const Post = require("../models/Post");

// Post 모델에 있는 모든 데이터 가져오기 [GET]
router.get("/allPosts", asyncHandler(async (req, res) => {
    const locals = {
        title: "Posts"
    }

    const data = await Post.find(); // Post라는 모델에서 모든 게시물 다 가져옴.
    res.render("admin/allPosts", { locals, data, latout: adminLayout });
}))
```
이제 allPosts.ejs파일을 만들어보자.
```
<!-- 로그인 후 전체게시물 한눈에 볼 수 있는 페이지 -->
<div class="admin-title">
    <h2><%= locals.title %></h2>
    <a href="#" class="button">+ 새 게시물</a>
</div>

<ul class="admin-posts">
    <% data.forEach(post => { %>
        <li>
            <a href="/post/<%= post._id %>">
                <%= post.title %>
            </a>
            <div class="admin-post-controls">
                <a href="#" class="btn">편집</a>
                <form action="#">
                    <input type="submit" value="삭제" class="btn-delete btn">
                </form>
            </div>
        </li>
    <% }) %>
</ul>
```
-> ejs문법을 잘 사용하여 for-each문을 통해 렌더링하였다.

남은것은 로그아웃 기능 구현이다.

---

## 로그아웃
로그아웃은 버튼을 눌렀을 시 쿠키에 있는 토큰을 삭제해주면 끝이다. 이후 일반 사용자가 보는 화면으로 redirect()만 시켜주면 된다.

admin.ejs파일에 관리자 로그아웃 부분으로 가서 href를 `"/logout"`으로 변경시켜 주고, 라우트 코드도 추가한다.

```
// 로그아웃 라우트코드
router.get("/logout", (req, res) => {
    res.clearCookie("token"); // 원래 쿠키에 저장되어있던 토큰 삭제.
    res.redirect("/"); // 로그인 이전 화면으로 돌아감.
});
```

---

# 게시물 추가 / 삭제
## 벡엔드 - CRUD API 만들기

![](https://velog.velcdn.com/images/king33/post/2c2b2ea6-8ae5-4b24-9e54-c625168ae314/image.PNG)

-> 왼쪽 처럼 온다면 해당 매뉴얼에 맞게 기능을 수행하겠다.

## ✨게시물 추가하기 - /add
ejs 파일 먼저 만들어보자.
admin폴더 -> add.ejs파일 추가 후 코드작성
```
<!-- 게시물 작성 화면 -->
<a href="/allPosts">$larr; 뒤로</a>
<div class="admin-title">
    <h2><%= locals.title %></h2>
</div>

<form action="/add" method="POST">
    <label for="title"><b>제목</b></label>
    <input type="text" placeholder="게시물 제목" name="title" id="title">

    <label for="body"><b>내용</b></label>
    <textarea name="body" id="body" cols="50" rows="10" placeholder="게시물 내용"></textarea>

    <input type="submit" value="등록" class="btn">
</form>
```

이젠 너무 자연스럽게 라우트 코드를 작성하러 가고 싶을 것이다.

admin.js 파일에 라우트 코드 2개(GET / POST)를 작성한다.
```
// 여기서부터 로그인 후 작업
// 게시물 추가 [GET]
router.get("/add", asyncHandler(async (req, res) => {
    const locals = {
        title: "게시물 작성"
    };
    // 제목을 표시하기 위해 locals도 같이 넘겨줌.
    res.render("admin/add", { locals, layout: adminLayout });
}));
```
```
// 게시물 추가 [POST]
router.get("/add", asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const newPost = new Post({
        title: title,
        body: body,
    });

    await Post.create(newPost); // Post 모델에 newPost 추가.
    res.redirect("/allPosts");
}));
```

여기까지 했다면 새 게시물 추가가 잘 이루어지는 것을 확인할 수 있다!
![](https://velog.velcdn.com/images/king33/post/3d7caa5d-7067-4067-9c0e-48b8c80bd8a9/image.PNG)

-> test 게시물이 잘 생성된 모습.

but 여기에서 문제점은, localhost:3000/add로 들어가기만 하면 <span style="color:red">로그인이 안 된 사람들</span>도 이 추가기능을 이용할 수 있다는 것이다.

### 🎑로그인 체크해주기 with <span style="color:gold">"토큰"</span>
미들웨어를 별도의 함수로 만들어서 app.js 선언해도 되지만, 체크하는 코드가 짧으므로 그냥 라우트코드에 정의한다.

admin.js에 checkLogin() 함수를 추가한다.
```
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
```
다시 라우트 코드로 이동하여 지금 미리 만들어둔 이 checkLogin() 함수를 로그인 후에 진행할 모든 기능들에 추가해준다.
```
// Post 모델에 있는 모든 데이터 가져오기 [GET] + 🔑checkLogin 추가
router.get("/allPosts", checkLogin, asyncHandler(async (req, res) => {
    const locals = {
        title: "Posts"
    };

    const data = await Post.find(); // Post라는 모델에서 모든 게시물 다 가져옴.
    res.render("admin/allPosts", { locals, data, layout: adminLayout });
}));

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
```
-> 🔑 키가 보이는 부분은 다 checkLogin함수가 추가된 것이다.

---

## ✨게시글 수정하기
다시 언급하지만, 폼 태그에서는 GET과 POST방식만 처리할 수 있으므로 우리는 _"method-override"_라는 모듈을 설치하여 사용할 것이다. (PUT 요청으로 변경)

`npm i method-override`

설치 후 app.js로 와서 사용한다고 알려주기
```
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
```

다음은 수정하기 버튼을 눌렀을 때 그 게시물의 내용을 그대로 일단 가져와서 보여주는 ejs파일을 만들어야 한다.

views -> admin폴더 -> edit.ejs파일 만들기
```
<!-- 게시물 수정 화면 - add.ejs랑 매우 비슷 -->
<a href="#">&larr; 뒤로</a>
<div class="admin-title">
    <h2><%= locals.title %></h2>
    <form>
        <input type="submit" value="삭제" class="btn btn-delete">
    </form>
</div>

<!-- 원래 폼에서 사용하는 method방식은 POST인데, 이를 PUT으로 바꾸기 위해서 _method를 통해 바꿔주는 것 -->
<form action="/edit/<%= data._id %>?_method=PUT" method="POST">
    <label for="title"><b>제목</b></label>
    <input type="text" name="title" id="title" value="<%= data.title %>">

    <label for="body"><b>내용</b></label>
    <textarea name="body" id="body" cols="50" rows="10"><%= data.body %></textarea>

    <!-- 이 수정버튼 클릭 시 PUT 요청을 보내게 된다. -->
    <input type="submit" value="수정" class="btn">
</form>
```
add.ejs파일과 매우 비슷한 형태이다.

allPosts.ejs의 수정 버튼에 링크만 이제 잘 연결해주면 끝!
```
<a href="/edit/<%= post._id %>" class="btn">수정</a>
```

---

## ✨게시글 삭제하기(LAST)
allPosts화면과 게시물 수정 화면에 보이는 삭제 총 2군데의 작업을 진행할것이다.

* allPosts.ejs - form부분 코드수정
`<form action="/delete/<%= post._id %>?_method=DELETE" method="POST">`
* edit.ejs - 얘도 마찬가지로 form부분 수정. but post->delete로 변수 변경해주기
`<form action="/delete/<%= data._id %>?_method=DELETE" method="POST">`

이제 링크에 대한 모든 작업은 완료되었고, 라우트 코드만 작성하면 모든게 끝이 난다.

```
// 게시물 삭제 + 🔑checkLogin 추가
router.delete("/delete/:id", checkLogin, asyncHandler(async (req, res) => {
    await Post.deleteOne({_id: req.params.id});
    res.redirect("/allPosts");
}));
```	

---

# 완강완료

![](https://velog.velcdn.com/images/king33/post/fb7d58a4-12c0-440a-b2cb-cdc9089a15e5/image.PNG)

<span style="color:purple">이 모든 자료들은 'Do it! Node.js 프로그래밍 입문' 강의를 바탕으로 제작되었습니다.
