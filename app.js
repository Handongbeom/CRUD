const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Post = require("./models/Post");
require("dotenv").config();

const app = express();

//몽고 DB에 연결하는 코드
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // mongoose 옵션
  })
  .then(() => console.log("데이터베이스 연결 성공"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.render("index", { posts });
}); // 데이터 베이스를 조회하여 어떤 게시물이 존재하는지 확인하는 작업
app.get("/posts/new", (req, res) => {
  res.render("create");
});

//글이 작성되는 요청 처리문
app.post("/posts", async (req, res) => {
  const { title, content } = req.body;
  const post = new Post({ title, content });
  await post.save();
  res.redirect("/");
});

//글 조회
app.get("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("show", { post });
});

//글 수정
app.get("/posts/:id/edit", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("edit", { post });
});

//수정 내용을 받아 적용
app.post("/posts/:id", async (req, res) => {
  const { title, content } = req.body;
  await Post.findByIdAndUpdate(req.params.id, { title, content });
  res.redirect(`/posts/${req.params.id}`);
});

//글 삭제 방식
app.post("/posts/:id/delete", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// 서버 시작
app.listen(3000, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});
