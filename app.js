require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = 'Добрый день! Меня зовут Олег Анисимов. Это мой персональный блог, где я периодически озвучиваю идеи. Блог позволяет мне добавлять и удалять посты. Посты хранятся на облаке MongoDB Atlas';
const contactContent = 'Если Вы заинтересовались моей кандидатурой прошу написать мне на почту anisimov-o@mail.ru';
const aboutContent = 'Отработав 7 лет по своей основной специальности и получив огромный опыт проектирования всего и вся, от каркаса самолета до сложной гидравлической системы машины разминирования, я внезапно понял что уперся в 3-х метровый бетонный потолок профессионального развития. Поразмыслив над своим не совсем удачным "планом по захвату мира" я все-таки пришел к выводу, что в 21 веке смена профессии не является катастрофой планетарного масштаба. Ко всему этому, давно вынашивал идею интернет-проекта для путешественников, но без какого-либо опыта создания приложений я даже не знал с какой стороны к нему подойти. Поэтому, в начале этого года, решил освоить Web Development как наиболее подходящую профессию, для обучения которой достаточно желания, упорства и времени. Погуглив, где вообще этому обучают, нашел курс на Udemy и потихоньку начал осваивать его. На данный момент продолжаю обучение. Если что не понимаю, гуглю, пересматриваю видеоуроки или ищу ответы на Stack Overflow. Также дополнительно решаю задачки на Edabit. Проблем с чтением технической документации нет, ибо английским владею на высоком уровне. На данный момент рассматриваю любые варианты трудоустройства вплоть до неоплачиваемой стажировки.';

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundPosts
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  })
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;
  // console.log(requestedPostId);
  Post.findById({
    _id: requestedPostId
  }, function(err, post) {
      res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});

app.get("/delete", function(req, res) {
  Post.find({}, function(err, foundPosts) {
    res.render("delete", {
      startingContent: homeStartingContent,
      posts: foundPosts
    });
  });
});

app.post("/delete", function(req, res) {
  // console.log(req.body.checkbox);
  const checkedPostId = req.body.checkbox;
  Post.findByIdAndRemove(checkedPostId, function(err) {
    if (!err) {
      res.redirect("/");
      // console.log("Succesfuly deleted post");
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
