(function() {
    angular.module('myApp',
        [
            'ngMaterial',
            'ui.router',
            'blogService',
            'blogController',
            'blogDirective',
            'froala',
            'blogFilter',
            'ui.bootstrap',
            'truncate',
            'loginController',
            'dirPagination',
            'md.data.table',
            'ui.bootstrap',
            'homeController',
            'ngAnimate',
            'ngFileUpload',
            'uploaderApp'
        ])
        .config(function ($stateProvider, $urlRouterProvider, $mdIconProvider) {
        $urlRouterProvider.otherwise("/edit");
        $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu", "./assets/svg/menu.svg", 24)
            .icon("share", "./assets/svg/share.svg", 24)
            .icon("google_plus", "./assets/svg/google_plus.svg", 512)
            .icon("hangouts", "./assets/svg/hangouts.svg", 512)
            .icon("twitter", "./assets/svg/twitter.svg", 512)
            .icon("phone", "./assets/svg/phone.svg", 512);
        $stateProvider
            .state('login', {
                url:'/login',
                templateUrl: './src/templates/login.html',
                controller: 'loginController as lc'
            })
            .state("home", {
                url: "/home",
                templateUrl: "./src/templates/home.html",
                controller: "HomeController as hc"
            })
            .state("newhome", {
                url: "/newhome",
                templateUrl: "./src/templates/newhome.html"
            })
            .state("jen", {
                url: "/jen",
                templateUrl: "./src/templates/jen.html"
            })
            .state("post", {
                url: "/posts/:blogParam",
                templateUrl: "./src/templates/post.html",
                controller: "BlogController as bc"
            })
            .state("edit", {
                url: "/edit/:blogParam",
                templateUrl: "./src/templates/edit-post.html",
                controller: "BlogController as bc"
            })
            .state("editor", {
                url:"/editor",
                templateUrl: "./src/templates/editor.html",
                controller: "BlogController as bc"
            })
            .state("masterlist", {
                url:"/master",
                templateUrl: "./src/templates/masterlist.html",
                controller: "BlogController as bc"
            })
            .state("about", {
                url:"/about",
                templateUrl: "./src/templates/about.html",
                controller: "BlogController as bc"
            })
            .state("counties", {
                url:"/counties/:cParam",
                templateUrl: "./src/templates/counties.html",
                controller: "BlogController as bc"
            })
            .state("categories", {
                url:"/categories/:catParam",
                templateUrl: "./src/templates/categories.html",
                controller: "BlogController as bc"
            })
            .state("posts", {
                url: "/posts",
                templateUrl: "./src/templates/posts.html",
                controller: 'BlogController as bc'
            });

        // if none of the above states are matched, use this as the fallback

        //$locationProvider.html5Mode(true);
    });
    $('.selector').froalaEditor({
        imageUploadToS3: {
            bucket: 'doingutahdaily',
            // Your bucket region.
            region: 's3-us-west-2',
            keyStart: 'uploads/',
            callback: function (url, key) {
                // The URL and Key returned from Amazon.
                console.log (url);
                console.log (key);
            },
            params: {
                acl: 'public-read', // ACL according to Amazon Documentation.
                AWSAccessKeyId: 'AKIAIRV6GSVS5RXFBRPQ', // Access Key from Amazon.
                policy: 'POLICY_STRING', // Policy string computed in the backend.
                signature: '' // Signature computed in the backend.
            }
        }
    });
})();

//
//});