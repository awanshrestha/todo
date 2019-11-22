const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var _ = require('lodash');

const app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(express.static("public"));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost:27017/todoDB", {useNewUrlParser: true,useUnifiedTopology: true });

const taskSchema = {
    name: String
};

const Task = mongoose.model("Task",taskSchema);

const defaulttask = new Task({
    name: "Add a task below."
});

const defaultTasks = [defaulttask];

const listSchema = {
    name:String,
    tasks: [taskSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/",(req,res)=>{
    List.find({},function(error,results){
        if(error){
            console.log("Eror");
        }
        else{
            if(results.length == 0){
                var today = new List({
                    name: "Today",
                    tasks: defaultTasks
                });
                today.save();
                res.redirect("/");
            } 
            else{
                res.redirect("/"+"today");
            }
        }
    });
});  
  
app.post("/addCategory",(req,res)=>{
    var newCategory = _.capitalize(req.body.newTopic);
    List.findOne({name: newCategory},function(error,found){
        if(!error){
            if(!found){
                var list = new List({
                    name: newCategory,
                    tasks: []
                });
                list.save();
                res.redirect("/" + newCategory);
            }
            else{
                res.redirect("/" + newCategory);
            }
        }
    });
});

app.get("/:customList",(req,res)=>{
    const customName = _.capitalize(req.params.customList);
    List.find({},function(err,allLists){
        if(!err){
            List.findOne({name: customName}, function(err, foundList){
                if (!err){
                    res.render("index",{title: foundList.name, tasks: foundList.tasks, results: allLists });
                }
              });
        }
    });
});

app.post("/",(req,res)=>{
    const taskName = req.body.newtask;
    const listName = req.body.list;

    const newt = new Task({
        name: taskName
    });
    List.findOne({name: listName}, function(err, foundList){
        foundList.tasks.push(newt);
        foundList.save();
        res.redirect("/" + listName);
      });
});



app.listen(3000, ()=>{
    console.log("listening at port 3000");
});