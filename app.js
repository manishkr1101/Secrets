//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true,  useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true})); 
app.use(express.static("public"));

const userSchema = new mongoose.Schema(
    {
        email: String,
        password: String
    }
);



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);


app.get('/', function(req, res){
    res.render('home',{});
});

app.get('/login', function(req, res){
    res.render('login',{});
});

app.post('/login', function(req, res){
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            res.send('user not found');
        }
        else{
            if(foundUser && foundUser.password === password){
                res.render('secrets');
            }
        }
    })
});

app.get('/register', function(req, res){
    res.render('register',{});
});

app.post('/register', function(req, res){
    let username = req.body.username;
    let password = req.body.password;

    const user = new User({
        email: username,
        password: password
    });
    user.save(function(err){
        if(err){
            console.log(err);
        }
        else{
            res.render('secrets');
        }
    });
});


app.listen(3000, function(){
    console.log('app started');
});