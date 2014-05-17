angular.module('ttgbotApp', [
	'ngRoute',
	'ttgbotApp.controllers',
	'ttgbotApp.filters',
	'ttgbotApp.services',
	'ttgbotApp.directives'
]).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'Controller1'});
	$routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'Controller2'});
	$routeProvider.otherwise({redirectTo: '/view1'});
}]);
