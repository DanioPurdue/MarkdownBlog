//login middleware
// import {generateToken} from "./authen";

var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const authen = require('./authen');


//login is not suceessfull
const unAuthLogin = function(req, res) {
    console.log("send the status");
    res.status(401).render('login', {username: req.body.username, password : req.body.password, redirect : req.body.redirect});
}

const verifyUser = function(req, res) {
    // Get the documents collection
    const collection = req.db.collection('Users');
    collection.find({username: req.body.username}).toArray(function(err, docs) {
        if(docs.length > 0) { //find the username and check the password
            bcrypt.compare(req.body.password, docs[0].password, function(err, cryptres) {
                if(cryptres) {
                    if(req.body.redirect == "" || req.body.redirect == undefined) {
                        res.cookie('jwt', authen.generateToken(req.body.username)).send("Authentication is successful");
                    }
                    else {
                        res.cookie('jwt', authen.generateToken(req.body.username)).redirect(req.body.redirect);
                    }
                }
                else {
                    console.log("testing login failed: " + req.body.password);
                    unAuthLogin(req, res);
                }
            });
        }
        else {
            console.log("testing login failed: " + req.body.password);
            unAuthLogin(req, res);
        }
    });
};


router.get('/', function(req, res, next) {
    res.render('login', {username: undefined, password : undefined, redirect : req.query.redirect});
});

router.post('/', function (req, res, next) {
    console.log("testing username: " + req.body.username);
    console.log("testing password: " + req.body.password);
    console.log("testing redirect: " + req.body.redirect + "type: " + typeof (req.body.redirect));
    verifyUser(req, res);
});

module.exports = router;