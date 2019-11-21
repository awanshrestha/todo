const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));

app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const taskSchema = {
    name:String
}

const Task = mongoose.model("Task",taskSchema);

const today = new Topic({
    name: "Today"
});
const college = new Topic({
    name: "College"
});

const defalutTopics = [today,college];

const listSchema = {
    name:String,

};

app.get("/",(req,res)=>{
    res.render("index");
});

app.listen(3000, ()=>{
    console.log("listening at port 3000");
});