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
		/**
		 * News event, just some text for testing.
		 */
		socketService.on('news', function(data) {
			console.log(data);
		});

		/**
		 * Update server load statistics in navbar when server sends them
		 */
		socketService.on('load', function(data) {
			$scope.load = {
				load: data.load,
				cpu: data.cpu,
				ram: data.memory/1024/1024 // Convert bytes to MB
			};
			$scope.$apply();
		});

		/**
		 * Update page title when page changes
		 */
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (angular.isDefined(toState.data.pageTitle)) {
				$scope.pageTitle = toState.data.pageTitle + ' | TTGBot';
			} else {
				$scope.pageTitle = 'TTGBot';
			}
		});
	})

;
