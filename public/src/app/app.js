angular.module('ngBoilerplate', [
		'templates-app',
		'templates-common',
		'ngBoilerplate.home',
		'ngBoilerplate.about',
		'ngBoilerplate.rc',
		'ngBoilerplate.socketService',
		'ui.router',
		'ngBoilerplate.directives'
	])

	.config(function myAppConfig($stateProvider, $urlRouterProvider) {
		'use strict';
		$urlRouterProvider.otherwise('/home');
	})

	.run(function run() {
	})

	.controller('AppCtrl', function AppCtrl($scope, $location, socketService) {
		'use strict';
		socketService.on('news', function(data) {
			console.log(data);
		});
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (angular.isDefined(toState.data.pageTitle)) {
				$scope.pageTitle = toState.data.pageTitle + ' | TTGBot';
			}
		});
	})

;