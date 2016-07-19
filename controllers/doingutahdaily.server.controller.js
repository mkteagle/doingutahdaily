var Blog = require('../models/doingutahdaily.server.model.js');

exports.create = function(req, res) {
    var add = new Blog({
        content: req.body.content,
        title: req.body.title
        // comments: []
    });
    add.save();

    res.redirect(301, '/');

};
exports.getBlog = function(req, res) {
     res.render('newBlog', {title: 'new Blog'});
};
