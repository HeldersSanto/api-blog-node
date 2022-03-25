const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const Posts = require("./Posts"); 
const variables = require("./.env/secret.json")

mongoose.connect(`mongodb+srv://root:${variables.USER_PASS}@cluster0.bxdth.mongodb.net/${variables.DATABASE}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("Conectado ao db")).catch((err)=>{console.log(err.message)})


app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/public", express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "/pages"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res)=>{

    if(req.query.busca == null){
        Posts.find({}).sort({"_id": -1}).exec((err, posts)=>{
            Posts.find({}).sort({'views': -1}).limit(3).exec((error, postsTop)=>{
                postsTop = postsTop.map(function(val){
                    return {
                        titulo: val.title,
                        conteudo: val.article,
                        imagem: val.image,
                        slug: val.slug,
                        categoria: val.category,
                        views: val.views
                    }
                })
            res.render("home", {posts: posts, postsTop: postsTop})
            })
        })
    }else{
        Posts.find({title: {$regex: req.query.busca, $options: "i"}}, (err, posts)=>{
            Posts.find({}).sort({'views': -1}).limit(3).exec((error, postsTop)=>{
                postsTop = postsTop.map(function(val){
                    return {
                        titulo: val.title,
                        conteudo: val.article,
                        imagem: val.image,
                        slug: val.slug,
                        categoria: val.category,
                        views: val.views
                    }
                })
            res.render("busca", {posts: posts, postsTop: postsTop, contagem: posts.length})
            })
        })
    }
})

app.get("/:slug", (req, res)=>{
    Posts.findOneAndUpdate({slug: req.params.slug}, {$inc: {views: 1}}, (err, response)=>{
        if(response !== null){
        Posts.find({}).sort({'views': -1}).limit(3).exec((error, postsTop)=>{
            postsTop = postsTop.map(function(val){
                return {
                    titulo: val.title,
                    conteudo: val.article,
                    imagem: val.image,
                    slug: val.slug,
                    categoria: val.category,
                    views: val.views
                }
            })
        res.render("single", {noticia: response, postsTop: postsTop})
        })
        }else{
            res.redirect("/");
        }
    })
})

app.listen(4000, () => console.log("Server Started"))