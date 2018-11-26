var express = require('express');
var router = express.Router();
let login_router = require('./login.js');
var blogRouter = require('./blog');
var apiRouter = require('./api');
var editor_router = require('./editorCheck');

/* GET home page. */
//login page
router.use('/editor', editor_router);
router.use('/login', login_router);
router.get('/',function (req,res) {
    res.render('index',{title:'Express'});
});

router.use('/blog', blogRouter);

router.use('/api', apiRouter);


module.exports = router;
