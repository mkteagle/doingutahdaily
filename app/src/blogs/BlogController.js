(function () {
    angular
        .module('blogController', [])
        .controller('BlogController', BlogController)
        .controller('DialogController', DialogController);
    BlogController.$inject = ['blogService', '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$mdMedia', '$stateParams', '$scope', '$location'];
    function BlogController(blogService, $mdSidenav, $mdBottomSheet, $mdDialog, $mdMedia, $stateParams, $scope, $location) {
        var self = this;
        var svgArr = ['svg-1', 'svg-2', 'svg-3', 'svg-4', 'svg-5'];
        var svgindex = 0;
        self.selected = null;
        self.blogs = blogService.blogs;
        self.selectBlog = selectBlog;
        self.toggleList = toggleBlogsList;
        self.toggleIt = toggleIt;
        self.addBlog = addBlog;
        self.firstList = firstList;
        self.getChange = getChange;
        self.removeBlog = removeBlog;
        self.getPost = getPost;
        self.counties = blogService.counties;
        self.categories = blogService.categories;
        self.seasons = blogService.seasons;
        self.login = login;
        self.post = blogService.post;
        self.county = blogService.county;
        self.addPostParam = addPostParam;
        self.currentPage = 1;
        self.pageSize = 5;
        self.reverse = '';
        self.getCounty = getCounty;
        self.getCounties = getCounties;
        self.location = $location;
        self.showEditBlog = showEditBlog;
        self.show = false;
        self.Files = blogService.Files;
        self.file = blogService.file;
        self.categoryName = '';
        self.addCategory = addCategory;
        self.deleteFeatured = deleteFeatured;
        self.uploadFiles = function (files) {
            blogService.uploadFiles(files);
        };
        function deleteFeatured () {
            blogService.deleteFeatured();
        }
        self.sort = function (keyname) {
            self.sortKey = keyname; //set the sortKey to the param passed
            self.reverse = !self.reverse; //if true make it false and vice versa
        };
        function addCategory() {
            blogService.addCategory(self.categoryName);
            self.categoryName = '';
        }
        self.showAdvanced = function (ev, post) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: './src/templates/preview-post.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    blog: post
                }
            });
        };
        function showEditBlog() {
            var reg = /^(?:((?:https?|s?ftp):)\/\/)([^:\/\s]+)(?::(\d*))?(?:\/([^\s?#]+)?([?][^?#]*)?(#.*)?)?/;
            console.log(reg.test(self.location));
            //regex to get first part of path and return it
            if (self.location = '/edit/') {
                self.show = true;
                return self.show;
            }
        }
        function getCounties(cParam) {
            blogService.getCounties(cParam);
        }
        function firstList() {
            self.selected = blogService.blogs[0];
        }
        function login() {
            auth.signin({}, function (profile, token) {
                // Success callback
                store.set('profile', profile);
                store.set('token', token);
                $location.path('/');
            }, function () {
                console.log("This is an error message");
                // Error callback
            });
        }
        function getCounty() {
            self.county = $stateParams.cParam;
            console.log(self.county);
        }
        function getPost() {
            blogService.getPost();
            self.blogs.$loaded()
                .then(function () {
                angular.forEach(self.blogs, function (blogname) {
                    if (blogname.param === $stateParams.blogParam) {
                        self.post = blogname;
                    }
                });
            });
        }
        // *********************************
        // Internal methods
        // *********************************
        function removeBlog(blog) {
            blogService.removeBlog(blog);
            self.selected = blogService.blogs[blogService.blogs.length - 1];
        }
        /**
         * First hide the bottomsheet IF visible, then
         * hide or Show the 'left' sideNav area
         */
        function addPostParam(blog) {
            blogService.addPostParam(blog);
        }
        function getChange(blog) {
            blogService.getChange(blog);
        }
        function addBlog() {
            blogService.addBlog(svgArr, svgindex);
            svgindex++;
        }
        function toggleBlogsList() {
            var pending = $mdBottomSheet.hide() || $q.when(true);
            pending.then(function () {
                $mdSidenav('left').toggle();
            });
        }
        function toggleIt() {
            $mdSidenav('left').toggle();
        }
        function selectBlog(blog) {
            self.selected = angular.isNumber(blog) ? $scope.blogs[blog] : blog;
            //self.toggleList();
        }
        self.countOf = function (text) {
            var s = text ? text.split(/\s+/) : 0; // it splits the text on space/tab/enter
            return s ? s.length : '';
        };
        self.taggerEnabled = false;
        self.editorEnabled = false;
        self.enableEditor = function (dates) {
            self.editorEnabled = true;
            self.editableValue = dates;
        };
        self.disableEditor = function () {
            self.editorEnabled = false;
        };
        self.save = function () {
            self.value = self.editableValue;
            self.disableEditor();
        };
        self.enableTagger = function (tags) {
            self.taggerEnabled = true;
            self.editableTag = tags;
        };
        self.disableTagger = function () {
            self.taggerEnabled = false;
        };
        self.tagSave = function () {
            self.value = self.editableTag;
            self.disableTagger();
        };
    }
    function DialogController($scope, $mdDialog, blog) {
        $scope.blog = blog;
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.postCheck = function () {
            console.log(blog);
        };
    }
})();