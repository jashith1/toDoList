//imports and settings
const express = require("express");
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const ejs = require('ejs')
const mongoose = require('mongoose');
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
  extended: true
}));

//creating db and collection
mongoose.connect('mongodb+srv://bloppai:oppai770@todolist.bprss.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

const CustomItemSchema = {
  name: {
    type: String,
    required: 1,
  },
  item: [{
    myItems: String
  }]
}

const CustomItemCollection = mongoose.model('customItem', CustomItemSchema);

//defining some values
let itemsNeeded;

//app.get
app.get("/", function(req, res) {
  res.redirect("/lists/home");
})

app.get("/lists/:urlPath", function(req, res) {
  const urlPath = req.params.urlPath;
  CustomItemCollection.find({
    name: urlPath
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length === 0) {
        const newItem = new CustomItemCollection({
          name: urlPath
        });
        newItem.save();
        res.redirect("/lists/" + urlPath)
      } else {
        itemsNeeded = result[0].item;
        res.render('toDoList', {
          title: urlPath,
          checker: itemsNeeded,
          pathAction: urlPath
        })
      }
    }
  })
})

//app.post
app.post("/lists/:urlPath", function(req, res) {
  const urlPath = req.params.urlPath;
  const userInsertedItem = req.body.newItem;
  let checkboxButton = req.body.checkbox;
  if (checkboxButton == null) {
    if (userInsertedItem === "//clear") {
      CustomItemCollection.deleteMany({
        name: urlPath
      }, function(err) {
        if (err) {
          console.log(err);
        }
        else{
          res.redirect("/lists/" + urlPath)
        }
      })
    } else if (userInsertedItem.startsWith("//switch")) {
      if (userInsertedItem.length === 8 || userInsertedItem.length === 9) {
        res.redirect("/lists/home")
      } else {
        res.redirect("/lists/" + userInsertedItem.slice(9));
      }
    } else {
      CustomItemCollection.updateOne({
        name: urlPath
      }, {
        $push: {
          item: {
            myItems: userInsertedItem
          }
        }
      }, function(error, success) {
        if (error) {
          console.log(error);
        }
        else{
          res.redirect("/lists/" + urlPath)
        }
      })
    }
  } else {
    CustomItemCollection.find({
      name: urlPath
    }, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        //delete this object nested inside the array
        CustomItemCollection.updateOne({
          name: urlPath
        }, {
          $pull: {
            item: {
              _id: checkboxButton
            }
          }
        }, function(err, success) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/lists/"+urlPath)
          }
        })
      }
    })
  }
})

//app.listen
app.listen(process.env.PORT || 3000, function(){
  console.log("BANZAI");
});
