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
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true,useUnifiedTopology: true });

const taskSchema = {
    name:String
}

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

app.get("/", function(req, res) {

    Task.find({}, function(err, foundTasks){
  
      if (foundTasks.length === 0) {
        Task.insertMany(defaultTasks, function(err){
          if (err) {
            console.log(err);
          } else {
            Task.find({},function(error,foundTask){
                if(!error){
                    List.insertMany([
                        {name: "Today", tasks: foundTask}
                    ],function(error){
                        if (err) {
                            console.log(error);
                          } else {
                            console.log("Successfully saved List items to DB.");
                          }
                    });
                }
            });
          }
        });     
        res.redirect("/");
      } else {
        List.find({},function(error,results){
            if(!error){
                var results = results;
                var title = results[0].name;
                var tasks = results[0].tasks;
                res.render("index", {title: title, tasks: tasks, results:results});
            }
        });
       
      }
    });
});

app.post("/addCategory",(req,res)=>{
    var newCategory = _.capitalize(req.body.newTopic);
    List.findOne({name: newCategory},function(error,found){
        if(!error){
            if(!found){
                const list = new List({
                    name: newCategory,
                    tasks: []
                });
                list.save();
                res.render("/" + newCategory);
            }
        }
    });
});

app.get("/:customName",(req,res)=>{
    const customName = _.capitalize(req.params.customName);
    List.findOne({name: customName},(error, results)=>{
        if(!error){
            var results = results;
            var title = results.name;
            var tasks = results.tasks;
            res.render("index", {title: title, tasks: tasks, results:results});
            }
        });
});

app.listen(3000, ()=>{
    console.log("listening at port 3000");
});