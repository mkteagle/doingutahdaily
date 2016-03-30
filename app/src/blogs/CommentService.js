(function(){
    angular.module('commentService', ['firebase'])
        .service('commentService', commentService);

    commentService.$inject = ['$firebaseArray', '$filter', 'blogService', '$stateParams'];

    function commentService ($firebaseArray, $filter, blogService, $stateParams) {
        var self = this;
        var ref = new Firebase("https://doingutahdaily.firebaseio.com/comments/");
        self.comments = $firebaseArray(ref);
        var newtime = $filter('date')(new Date(), 'HH:mm:ss');
        var newdate = $filter('date')(new Date(), 'MM/dd/yyyy');
        self.selected = blogService.post;
        self.blogs = blogService.blogs;
        self.add = add;
        self.commentCollection = [];
        self.getComments = getComments;
        function getComments() {
            self.blogs.$loaded()
                .then(function () {
                    angular.forEach(self.blogs, function(blog) {
                        self.comments.$loaded()
                            .then(function() {
                                angular.forEach(self.comments, function(comment) {
                                    if (blog.param == comment.blog) {
                                        self.commentCollection.push(comment);
                                    }
                                })
                            })
                    })
                })
        }
        function add () {
            console.log($stateParams.blogParam);
            //console.log(self.selected.title);
            self.comments.$add({name: 'mike', content: 'this is cool content', reference: 'new comment', blog: $stateParams.blogParam, date: newdate, time: newtime})
        }
    }
})();
