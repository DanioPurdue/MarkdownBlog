var express = require('express');
var router = express.Router();
const authen = require('./authen');
let db;

router.get('/:username', (req,res) => {
    let token = req.cookies.jwt;
    console.log(req);
    authen.verifyToken(token,req,res,handleError,findPosts);

});

router.get('/:username/:postid',(req,res) => {
    let token = req.cookies.jwt;
    authen.verifyToken(token,req,res,handleError,findOnePost);
});

router.post('/:username/:postid', (req,res) => {
    let token = req.cookies.jwt;
    authen.verifyToken(token,req,res,handleError,insertPost);
});

router.put('/:username/:postid', (req,res) => {
    let token = req.cookies.jwt;
    authen.verifyToken(token,req,res,handleError,updatePost);
});

router.delete('/:username/:postid',(req,res) => {
    let token = req.cookies.jwt;
    if(token == undefined || token == null) {
        res.status(401).json();
    } else {
        authen.verifyToken(token,req,res, handleError, findAndDeleteAPost);
    }
});



// helper functions
function handleError(req,res) {
    res.status(404).send();
}

function findPosts(req,res){
    db = req.db;
    db.collection('Posts').find({'username': req.params.username}).toArray(function (err,result) {
        res.status(200).json(result);
    });
}

function findOnePost(req,res){
    db = req.db;
    db.collection('Posts').find({$and: [{'username':req.params.username},{'postid':parseInt(req.params.postid)}]}).toArray(function (err,result) {
        if (result.length == 0){
            res.status(404).json();
        }else {
            res.status(200).json(result);
        }
    });
}

function insertPost(req,res){
    db = req.db;
    let title = req.body.title;
    let body = req.body.body;
    console.log("request: ",req.body);
    if (title == null || body == null){
        res.status(400).json();
    }
    let time = (new Date()).getTime();
    db.collection('Posts').find({$and: [{'username':req.params.username},{'postid':parseInt(req.params.postid)}]}).toArray(function (err,result) {
        //console.log("find post: ",result);
        if (result.length != 0){
            res.status(400).json();
        }else{
            db.collection('Posts').insertOne({'postid':parseInt(req.params.postid),'username':req.params.username,'created':time,'modified':time,'title':title,'body':body},(err,doc)=>{
                if (doc){
                    res.status(201).json();
                }
            });
        }
    });
}

function updatePost(req,res){
    db = req.db;
    let title = req.body.title;
    let body = req.body.body;
    let time = (new Date()).getTime();
    if (title == null || body == null || title == undefined || body == undefined){
        res.status(400).json();
    }
    else{
        db.collection('Posts').find({$and: [{'username':req.params.username},{'postid':parseInt(req.params.postid)}]}).toArray((err,result) => {
            if (err){
                res.status(404).json();
            }
            if (result.length == 0){
                res.status(400).json();
            }else{
                db.collection('Posts').update({$and: [{'username':req.params.username},{'postid':parseInt(req.params.postid)}]},
                    {$set:{"title":title,'body':body,'modified':time}})
                    .then(() => res.status(200).json())
            }
        });
    }

}

function findAndDeleteAPost(req,res){
    try{
        db = req.db;
        db.collection('Posts').find({$and: [{'username':req.params.username},{'postid':parseInt(req.params.postid)}]}).toArray(function (err,result) {
            if (result.length == 0){
                res.status(400).json();
            }else { //go a head and delete the file
                //if this there is one element go head and delete the user table
                console.log("username: " + req.params.username);
                console.log("postid: " + req.params.postid);
                db.collection('Posts')
                    .deleteOne({$and: [{"username":req.params.username},{"postid":parseInt(req.params.postid)}]})
                    .then(function (result) {
                        res.status(204).json();
                    });
            }
        });
    }catch(e) {
        console.log("Error: ", e.message);
    }

}
module.exports = router;