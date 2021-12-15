// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));


// init sqlite db
const db = require("./train_data.js");
db.init("./.data/train_data.db");


// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

// kvs.check
app.post("/check", (reqest, response) => {
  var key = reqest.body.key;
  console.log("check: key = %s", key);
  db.checkTrainer(key, (rows) => {
    if (rows.length == 0) {
      response.send({
        message: "not found"
      });  
    } else {
      response.send({
        message: "found"
      });
    }
  });
});

// kvs.get
app.post("/get", (reqest, response) => {
  var key = reqest.body.key;
  console.log("get: key = %s", key);
  db.getRule(key, (rows) => {
    console.log(rows);
    if (rows.length == 0) {
      response.send({
        message: "not found"
      });  
    } else {
      response.send({
        message: "success",
        reqest: key,
        response: rows[0].rule
      });
    }
  });
});

// kvs.put
app.post("/put", (reqest, response) => {
  var key = reqest.body.key;
  var val = reqest.body.val;
  console.log("put: key = %s", key);
  console.log("put: val = %s", val);
  db.putRule(key, val, (rows) => {
    response.send({
      message: "success"
    });  
  });
});

// kvs.set
app.post("/set", (reqest, response) => {
  var key = reqest.body.key;
  var val = reqest.body.val;
  console.log("set: key = %s", key);
  console.log("set: val = %s", val);
  db.setRule(key, val, (rows) => {
    response.send({
      message: "success"
    });  
  });
});

/*
// endpoint to get all the dreams in the database
app.get("/getDreams", (request, response) => {
  console.log(`getDreams:`);
///   db.getDreams(rows => {
///     response.send(JSON.stringify(rows));
///   });
  response.send({ message: "success" });
});

// endpoint to add a dream to the database
app.post("/addDream", (request, response) => {
  console.log(`addEreams:`);
///   const cleansedDream = cleanseString(request.body.dream);
///   db.addDreams(cleansedDream, (error) =>{
///     if (error) {
///       response.send({ message: "error!" });
///     } else {
  response.send({ message: "success" });
///     }  
///   });
});

// endpoint to clear dreams from the database
app.get("/clearDreams", (request, response) => {
  console.log(`clearEreams:`);
///   db.clearDreams((error) => {
///     if (error) {
///       response.send({ message: "error!" });
///     } else {
  response.send({ message: "success" });
///     }  
///   });
});

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
*/

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});