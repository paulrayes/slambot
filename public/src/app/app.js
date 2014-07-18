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
			var load = Math.round(data.load * 100) / 100;
			var cpu = Math.round(data.cpu * 10) / 10;
			var ram = Math.round(data.memory/1024/1024);

			console.log('load: ' + data.load);
			console.log('cpu: ' + data.cpu + ' %');
			console.log('ram: ' + data.memory/1024/1024 + ' MB');

			document.querySelector('#load').innerHTML = 'Load: ' + load + ' | CPU: ' + cpu + ' % | RAM: ' + ram + ' MB';
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
