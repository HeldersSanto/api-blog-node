const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostsSchema = new Schema({
    title: String,
    article: String,
    category: String,
    slug:  String,
    image: String,
    views: Number
},{collection: "Posts"})

const Posts = mongoose.model("Posts", PostsSchema);

module.exports = Posts;