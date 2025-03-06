(function () {
    var app = angular.module('search', []);

    app.controller('SearchController', ['$http', function ($http) {
        var everything = this;
        everything.collections;
        everything.images;
        everything.sheets;
        $http.jsonp('http://spikejones.tc.uvu.edu/retrieve/collections?callback=JSON_CALLBACK').success(function(response){
            console.log('data = ' + response);
            everything.collections = response;
        });
        $http.jsonp('http://spikejones.tc.uvu.edu/retrieve/images?callback=JSON_CALLBACK').success(function(response){
            console.log('data = ' + response);
            everything.images = response;
        });
        $http.jsonp('http://spikejones.tc.uvu.edu/retrieve/sheets?callback=JSON_CALLBACK').success(function(response){
            console.log('data = ' + response);
            everything.sheets = response;
        });
    }]); 

})();