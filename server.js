const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const randomstring = require("randomstring");
const flash = require('connect-flash');
const session = require('express-session');
const User = require("./models/User");
const Survey = require("./models/Survey");

// Load config
dotenv.config({ path: "./configs/config.env" });

const port = process.env.PORT || 3010;
const DB_URI = 'mongodb://localhost/waawsurvey-form';

// DB Connection
mongoose.connect(DB_URI)
   .then((dbconnect) => console.log('DB connected successfully ::::::::'))
   .catch((error) => console.log('DB connection error:', error.message));

const app = express();

// SETTING UP EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// express-session
app.use(
  session({
    secret: 'secret',
    resave: false,
     saveUninitialized: false,
    cookie: { maxAge: 60000 }
  })
);

// Set global variables
app.locals.moment = require('moment');

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//  Home Page "/"
app.get("/", async (req, res, next) => {
   try {
      res.render('index', {
         success: req.flash("success"),
         error: req.flash("error")
      });

   } catch (err) {
      console.log(err)
   }
});

// Filled form Page "/user-data"
app.get("/user-data", async (req, res, next) => {
   try {
       let userData = await User.findOne({ user: req.user }).sort({ _id: -1 });

      if (userData) {
         res.render('user-data', {
            userData,
            success: req.flash("success"),
            error: req.flash("error")
         });
         }
   } catch (err) {
      console.log(err)
   }
});

// Survey form Page "/survey"
app.get("/survey", async (req, res, next) => {
   try {
      res.render('survey', {
            success: req.flash("success"),
            error: req.flash("error")
         });

   } catch (err) {
      console.log(err)
   }
});

// Post user data to database
app.post("/user/create", async (req, res, next) => {
   try {

      let {
         firstname,
         lastname,
         email,
         phone, } = req.body;

   if (!firstname || !lastname || !email || !phone) {

      req.flash('error', 'Please fill all applicable fields');
      res.redirect('/') ;
 
      } else {
         let newUser = new User({
            firstname,
            lastname,
            email,
            phone,
            userID: randomstring.generate(10)
         });


      //  save new user to database
         await newUser.save();
         
      /*****flashmessage for alert *****/
      req.flash('success', 'User data submitted successfully, copy your unique ID for reference purpose');

      res.redirect('/user-data');
      } 

   } catch (err) {
      console.log('Error: ', err)
   }

});

// Post filled survey form data
app.post("/survey-data/create", async (req, res, next) => {
   try {
      let {
         title,
         description,
         place,
         start,
         end,
         userID } = req.body;

      let user = await User.findOne({ user: req.user }).sort({ _id: -1 });

      
      if (!title || !description || !place || !start || !end || !userID) {

         req.flash('error', 'Please fill all applicable fields');
         res.redirect('/survey');
   
      }

      if (userID !== user.userID) {
         req.flash('error', 'User ID do not match, please check that your ID is correct');
         res.redirect('/survey');
      } else {
         
      let newSurvey = new Survey({
         title,
         description,
         place,
         start,
         end,
         userID
      });
  
      //  save new survey data to database
      await newSurvey.save();

      /*****flashmessage for alert *****/
      req.flash('success', 'Form submitted successfully, Thank you for taking the survey');
      res.redirect('/');
      }

   } catch (err) {
      console.log(err);
   }
});

app.listen(port, ()=> console.log(`server running on port:: ${port}`));