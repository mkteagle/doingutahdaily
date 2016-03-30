(function() {
    'use strict';
    angular.module('blogDirective', [])
        .directive("clickTo", function () {
            return {
                restrict: "A",
                templateUrl: "./src/templates/clickto.html"
            }
        })
        .directive("clickToTag", function(){
            return {
                restrict: "A",
                templateUrl: "./src/templates/clicktotag.html"
            }
        })
        .directive("commentDir", commentDir);
        commentDir.$inject = ['commentService'];
        function commentDir (commentService) {
            var commentController = function () {
                var cc = this;
                cc.add = add;
                function add() {
                    commentService.add();
                }
            };
            return {
                restrict: "EC",
                templateUrl: "./src/blogs/views/comments.html",
                controller: commentController,
                controllerAs: 'cc',
                bindToController: true
            }
        }

}());


