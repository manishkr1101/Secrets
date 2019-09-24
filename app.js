//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
const bcrypt = require('bcrypt');
let saltRound = 10;
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
            if(foundUser){
                bcrypt.compare(password, foundUser.password, (err, result) => {
                    if(result === true){
                        res.render('secrets');
                    }
                    else{
                        res.send('wrong password');
                    }
                });
                
            }
            else{
                res.send('user not found');
            }
        }
    });
});

app.get('/register', function(req, res){
    res.render('register',{});
});

app.post('/register', function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    

    bcrypt.hash(password, saltRound, (err, hash) => {
        const user = new User({
            email: username,
            password: hash
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

    
});


app.listen(3000, function(){
    console.log('app started');
});

function clog(expr){
    console.log(expr);
}