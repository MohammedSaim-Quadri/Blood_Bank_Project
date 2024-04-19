var express = require("express");
var bodyParser = require("body-parser");
const ejs = require('ejs');
const port = 3000;
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/bbm');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
  console.log("connection succeeded");
})
var app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.json());//lib used
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {        //
  res.sendFile(__dirname + "/Dashboard.html");
});


app.post("/", (req, res) => { //
  console.log("Got body:", req.body);
  var myobj = req.body;
  db.collection("donor").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  // console.log('Got body:', req.body);
  // res.sendStatus(200);
});

const router = express.Router();
router.get('/index', function (req, res) {
  res.sendFile(__dirname + '/index.html');
  //__dirname : It will resolve to your project folder.
});
router.get('/Dashboard', function (req, res) {
  res.sendFile(__dirname + '/Dashboard.html');
  //__dirname : It will resolve to your project folder.
});
// router.get('/userlog', function (req, res) {
//   res.sendFile(__dirname + '/userlog.html');
//   //__dirname : It will resolve to your project folder.
// });
// router.get('/adminlogin', function (req, res) {
//   res.sendFile(__dirname + '/adminlogin.html');
//   //__dirname : It will resolve to your project folder.
// });

app.post('usersignup', function (req, res) {
  console.log("Hello World!");
  console.log("Got body:", req.body);
  var myobj = req.body;
  db.collection("user").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  return res.sendFile(__dirname + '/index.html');
});
app.post('/adminlogin', function (req, res) {
  console.log("Hello World!");
  var email = req.body.email;
  var pass = req.body.password;
  console.log(email);
  console.log(pass);
  // var data = {
  //    "name": name,
  //    "email":email,
  //    "password":pass,
  //    "phone":phone
  // }
  db.collection('receptionist').count({ email: email, password: pass }, function (err, collection) {
    if (err) throw err;

    //console.log(collection);
    if (collection != 0) {

      console.log("login successfull");
      //alert("Login Successfully!!");
      return res.sendFile(__dirname + '/public/html/addash.html');
    }
    else {

      console.log("login unsuccessfull");
      //alert("Login Unsuccessful!!")
      return res.sendFile(__dirname + '/public/html/adminlogin.html');

    }
  });
})

app.post('/userlog', function (req, res) {
  console.log("Hello World!");
  var email = req.body.email;
  var pass = req.body.password;
  console.log(email);
  console.log(pass);
  // var data = {
  //    "name": name,
  //    "email":email,
  //    "password":pass,
  //    "phone":phone
  // }
  db.collection('user').count({ email: email, password: pass }, function (err, collection) {
    if (err) throw err;

    //console.log(collection);
    if (collection != 0) {

      console.log("login successfull");
      //alert("Login Successfully!!");
      return res.sendFile(__dirname + '/index.html');
    }
    else {

      console.log("login unsuccessfull");
      //alert("Login Unsuccessful!!")
      return res.sendFile(__dirname + '/public/html/userlog.html');

    }
  });
})



app.post('/appointment', function (req, res) {
  console.log("Hello World!");
  var mode = req.body.mode;
  var myobj = req.body;
  console.log(mode);
  db.collection(mode).insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  return res.sendFile(__dirname + '/public/html/addash.html');
});


app.post('/donor', function (req, res) {
  console.log("Hello World!");
  console.log("Got body:", req.body);
  var myobj = req.body;
  db.collection("Donor").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  return res.sendFile(__dirname + '/index.html');
})
app.post('/receiver', function (req, res) {
  console.log("Hello World!");
  console.log("Got body:", req.body);
  var myobj = req.body;
  db.collection("Receiver").insertOne(myobj, function (err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
  return res.sendFile(__dirname + '/index.html');
})

app.get('/detail', function (req, res) {
  // console.log("Got body:", req.body);
  console.log("Hello!")
  // var myobj = req.body;

  db.collection("Donor").find({}).toArray(function (err, result) {
    if (err) throw err;
    res.render('detail', {
      name : result[0].name,
      mode : result[0].mode,
      blood : result[0].blood,
      phone : result[0].phone,
      country : result[0].country,
      state : result[0].state,
      city : result[0].city,
      address : result[0].address,
    });
    db.close();
  });
})

app.use('/', router);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});