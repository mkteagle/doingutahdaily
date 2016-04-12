var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = express.Router();
var fs = require('fs');
var blogs = [];
var categories = [];
var counties = [];
var seasons = [];
var comments = [];
var index = 1;
var date = Date.now();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/doingutahdaily';

app.use('/', express.static(__dirname + '/app'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/api', router);

var port = (process.env.PORT || 5000);

function findBlogs(db, callback) {
    var cursor = db.collection('blogs').find();
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            blogs.push(doc);
        }
        else {
            console.log(blogs);
            callback();
        }
    })
}

function findCategories(db, callback) {
    var cursor = db.collection('categories').find();
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            categories.push(doc);

        }
        else {
            callback();
        }
    })
}
function findCounties(db, callback) {
    var cursor = db.collection('counties').find();
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            counties.push(doc);
        }
        else {
            callback();
        }
    })
}
function findSeasons(db, callback) {
    var cursor = db.collection('seasons').find();
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            seasons.push(doc);
        }
        else {
            callback();
        }
    })
}
function insertDocument(db, blog, callback) {
    db.collection('blogs').insertOne(blog, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the blogs collection.");
        callback();
    });
}
function findComments(db, blog, callback) {
    blog._id = new ObjectId(blog._id);
    db.collection('blogs').find(
        {_id: blog._id }, blog, function(err, results) {
            if (err) throw err;
            console.log('Found record');
        });
}
function updatePost(db, blog, callback) {
    blog._id = new ObjectId(blog._id);
    db.collection('blogs').replaceOne(
        { _id : blog._id }, blog,
        function(err, results) {
            if (err) throw err;
            console.log('Updated Record');
            callback();
        });
}
function updateComment(db, blog, callback) {
    blog._id = new ObjectId(blog._id);
    db.collection('blogs').replaceOne(
        { _id : blog._id }, blog,
        function(err, results) {
            if (err) throw err;
            console.log('Updated Record');
            callback();
        });
}
MongoClient.connect(url, (err, db) => {
    assert.equal(null, err);
    findBlogs(db, function() {
        // db.close();
    });
    findCategories(db, function() {
        // db.close();
    });
    findCounties(db, function() {
        // db.close();
    });
    findSeasons(db, function() {
        // db.close();
    });
});
router.route('/blogs')
    .get(function(req, res) {
        blogs = [];
        MongoClient.connect(url, (err, db) => {
            assert.equal(null, err);
            findBlogs(db, function () {
                db.close();
                res.json(blogs);
            });
        });
    });
router.route('/categories')
    .get(function(req, res) {
        res.json(categories);
    });
router.route('/counties')
    .get(function(req, res) {
        res.json(counties);
    });
router.route('/seasons')
    .get(function(req, res) {
        res.json(seasons);
    });
router.route('/addPost')
    .post(function(req, res) {
        MongoClient.connect(url, (err, db) => {
            assert.equal(null, err);
            insertDocument(db, req.body, function() {
                db.close();
            });
        });
        blogs.push(req.body);
        res.json(blogs);
    });
router.route('/updatePost')
    .put(function(req, res) {
        MongoClient.connect(url, (err, db) => {
            assert.equal(null, err);
            updatePost(db, req.body, function() {
                db.close();
                res.end();
            });
        });
        
    });
router.route('/comment')
    .put(function(req, res) {
        MongoClient.connect(url, (err, db) => {
            assert.equal(null, err);
            updateComment(db, req.body, function() {
                db.close();
            });
        });
        res.json(blogs);
    })
    .post(function(req, res) {
        MongoClient.connect(url, (err, db) => {
            assert.equal(null, err);
            findComments(db, req.body, function() {
                db.close();
            });
            if (req.body.comments === null || req.body.comments === undefined) {
                res.json(comments);
            }
            comments = req.body.comments;
            res.json(comments);
        });
    });
app.listen(port, function() {
	console.log(`App listening on port ${port}...`);
});
