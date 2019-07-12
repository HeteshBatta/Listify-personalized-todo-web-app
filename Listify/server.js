var express = require('express')
var path = require('path')
var app = express()
var session = require('express-session');
var ejs = require('ejs');
var fs = require('fs');
var http = require('http');
var nodemailer = require('nodemailer');
var multer = require('multer');
var passport = require('passport');
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'Views'));
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({secret: "xYUCAchitkaraa"}));
//Connect with db
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';

app.use(passport.initialize());
app.use(passport.session());
var photoloc = '/uploads/defaultProfilePicture'

mongoose.connect(mongoDB);

mongoose.connection.on('error', (err) => {
    console.log('DB connection Error');
});

mongoose.connection.on('connected', (err) => {
    console.log('DB connected');
});

var userSchema = new mongoose.Schema
({
    username : String ,
    password : String ,
    email : String ,
    dob : String ,
    gender : String ,
    photopath : String ,
    taskstobedone : Array ,
    tasksdone : Array
})

var user =  mongoose.model('listifyuser', userSchema);

const storage1 = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
    photoloc =  req.session.email + path.extname(file.originalname);
    cb(null,req.session.email + path.extname(file.originalname));
  }
});

const upload1 = multer({
  storage: storage1,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('profilePhoto');
// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

app.post('/upload1', (req, res) =>
{
  console.log("upload start");
  upload1(req, res, (err) => {
    if(err)
    {
      console.log(err);
      res.send();
    }
    else
    {
      if(req.file == undefined)
      {
        console.log(req.file);
        console.log("image undefined");
        res.send();
      }
      else
      {
      console.log("done");
      console.log(req.session.email);
      res.render('newUser',{
        file:`uploads`
      });
      }
    }
  });
});

app.get('/TodoPage' , (req,res)=>
{
  res.render('Listpage');
})

app.get('/logout' , (req,res)=>
{
  req.session.destroy();
  res.render('Login');
})

app.get('/Login' , (req,res)=>
{
  res.render('Login');
})

app.get('/CreateAccount' , (req,res)=>
{
  res.render('newUser');
})

app.post('/search',function (req, res)
{
  console.log(req.body.username+req.body.password)
  user.find
  ({
       username : req.body.username ,
       password : req.body.password
  })
  .then(data =>
    {
      console.log(data);
      if(data && data.length)
      {
      req.session.isLogin = 1;
      req.session.username = data[0].username;
      req.session.email = data[0].email;
      }
      res.send(data);
    })
    .catch(err => {
      console.error(err)
      res.send(error)
    })
})

app.post('/addnewTask',function (req, res) {
 console.log(req.body.task + req.session.email);
   user.findOneAndUpdate(
    {
       email : req.session.email // search query
    },
    {
        $push: { taskstobedone:req.body.task }
    },
    {
      new: true,                       // return updated doc
      runValidators: true              // validate before update
    })
    .then(data =>
      {
        console.log(data)
        res.send(data)
      })
      .catch(err => {
        console.error(err)
        res.send(error)
      })
})

app.post('/addnewUser' , function(req,res)
{
  console.log(req.body);
  let newuser = new user({
    username : req.body.username ,
    password : req.body.password ,
    email : req.body.email ,
    gender : req.body.gender ,
    dob : req.body.dob ,
    photopath : req.body.email+'.png'
  })
  newuser.save()
   .then(data => {
     req.session.email = req.body.email;
     console.log(data+"**")
     res.send(data)
   })
   .catch(err => {
     console.error(err)
     res.send(error)
   })
   var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'meetgreet12@gmail.com',
     pass: 'meetgreet123!'
   }
 });
 var mailOptions = {
   from: 'meetgreet12@gmail.com',
   to: req.body.email,
   subject: 'Welcome to Listify',
   text: 'Welcome to Listify! Have a nice day ! - Hetesh Batta'
 };

 transporter.sendMail(mailOptions, function(error, info){
   if (error) {
     console.log(error);
   } else {
     console.log('Email sent: ' + info.response);
   }
 });
});

app.get('/getnameandimage', function(req,res){
  console.log(req.session)
   user.find({
      email : req.session.email   // search query
    })
    .then(data => {
        console.log(data)
        res.send(data)
      })
      .catch(err => {
        console.error(err)
        res.send(error)
      })
})

app.post('/deletefromarray' , function(req,res)
{
  console.log(req.body.text + "**");
    user.findOneAndUpdate(
     {
        email : req.session.email // search query
     },
     {
         $pull : { taskstobedone:req.body.text }
     },
     {
       new: true,                       // return updated doc
       runValidators: true              // validate before update
     })
     .then(data =>
       {
         console.log(data)
         res.send(data)
       })
       .catch(err => {
         console.error(err)
         res.send(error)
       })
 })

app.listen(8000)
