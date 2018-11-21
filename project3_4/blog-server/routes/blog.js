var express = require('express');
var router = express.Router();
var commonmark = require('commonmark');

let db;
/* GET home page. */

router.get('/:username', function(req, res, next) {
    // const collection = db.collection("Posts");
    db = req.db;
    const PAGE_SIZE = 5;
    let start = getStartIdx(req);
    if (start<1){
        res.status(400).send();
        // send our error page
    }
    else
    {
        db.collection("Posts").find({'username':req.params.username}).skip(start-1).limit(PAGE_SIZE).toArray(function (err,posts) {
            if (posts.length == 0){
                res.status(400).send();
            }else{
                res.render('blog',{posts:posts, start:start, username:req.params.username});
            }
        });
    }

});

router.get('/:username/:postid', function(req, res, next) {
    db = req.db;
    let start = getStartIdx(req);
    db.collection("Posts").find({$and: [{'username':req.params.username}, {'postid':parseInt(req.params.postid)}]}).toArray(function (err,post) {
        // if post does not exist{
            // send out error
        //}
        if (post.length == 0)
        {
            res.status(400).send();
        }

        else
        {
            let md_post = parseMarkdown(post);
            res.render('post',{post:md_post, start:start, username:req.params.username});
        }

    });
});

function getStartIdx(req){
    let start = req.query.start;
    if (start === undefined){
        start = 1;
    }else{
        start = parseInt(start);
    }
    return start;
}

function parseMarkdown(post){
    let md_post = Object.assign({},post);
    var reader = new commonmark.Parser();
    var writer = new commonmark.HtmlRenderer();
    md_post.title = writer.render(reader.parse(md_post[0].title));
    md_post.body = writer.render(reader.parse(md_post[0].body));
    return md_post
}
module.exports = router;