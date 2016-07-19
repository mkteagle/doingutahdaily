var express = require('express');
var router = express.Router();
var Blog = require('../controllers/doingutahdaily.server.controller.js');

router.get('/', function(req, res) {
    res.render('index', {title: 'Express'});
});

router.post('/addBlog', function(req, res) {
    return Blog.create(req, res);
});
router.get('/allblogs', function (req, res) {
    return Blog.getBlog(req, res);
});

