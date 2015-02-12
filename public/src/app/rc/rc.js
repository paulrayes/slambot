angular.module('ngBoilerplate.rc', [
		'ui.router',
		'ui.bootstrap',
		'ngBoilerplate.motorsService'
	])

	.config(function config($stateProvider) {
		'use strict';
		$stateProvider.state('rc', {
			url: '/rc',
			views: {
				'main': {
					controller: 'RcCtrl',
					templateUrl: 'rc/rc.tpl.html'
				}
			},
			data: { pageTitle: 'Remote Control' }
		});
	})

	.controller('RcCtrl', function AboutCtrl($scope, $document, motorsService) {
		'use strict';

		$scope.desiredSpeed = 0;
		$scope.desiredDirection = 0;
		$scope.actualSpeed = -10;
		$scope.actualDirection = 10;

		$scope.$watch(function() {
			return motorsService.desiredSpeed;
		}, function(value) {
			$scope.desiredSpeed = value;
		});

		$scope.$watch(function() {
			return motorsService.desiredDirection;
		}, function(value) {
			$scope.desiredDirection = value;
		});

		$scope.$watch(function() {
			return motorsService.actualSpeed;
		}, function(value) {
			$scope.actualSpeed = value;
		});

		$scope.$watch(function() {
			return motorsService.actualDirection;
		}, function(value) {
			$scope.actualDirection = value;
		});

		$scope.leftMotor = motorsService.left;
		$scope.rightMotor = motorsService.right;

		$scope.$watch(function() {
			return motorsService.left.desiredSpeed;
		}, function(value) {
			$scope.desiredLeftSpeed = value + 100;
		});

		$scope.$watch(function() {
			return motorsService.right.desiredSpeed;
		}, function(value) {
			$scope.desiredRightSpeed = value + 100;
		});

		$document.bind('keydown', function(event) {
			var keyCodes = {
				87: 'w',
				65: 'a',
				83: 's',
				68: 'd'
			};

			var key = keyCodes[event.which];
			if (typeof key !== 'undefined') {
				if (key === 'w') {
					if (motorsService.desiredSpeed !== 100) {
						motorsService.desiredSpeed = 100;
					}
				} else if (key === 's') {
					if (motorsService.desiredSpeed !== -100) {
						motorsService.desiredSpeed = -100;
					}
				} else if (key === 'a') {
					if (motorsService.desiredDirection !== -100) {
						motorsService.desiredDirection = -100;
					}
				} else if (key === 'd') {
					if (motorsService.desiredDirection !== 100) {
						motorsService.desiredDirection = 100;
					}
				}
			}
		}.bind(this));

		$document.bind('keyup', function(event) {
			var keyCodes = {
				87: 'w',
				65: 'a',
				83: 's',
				68: 'd'
			};

			var key = keyCodes[event.which];
			if (typeof key !== 'undefined') {
				if (key === 'w' || key === 's') {
					if (motorsService.desiredSpeed !== 0) {
						motorsService.desiredSpeed = 0;
					}
				} else if (key === 'a' || key === 'd') {
					if (motorsService.desiredDirection !== 0) {
						motorsService.desiredDirection = 0;
					}
				}
			}
		}.bind(this));

		var lastTimestamp = 0;

		setInterval(function() {
			var gamepad = navigator.getGamepads && navigator.getGamepads()[0];
			if (gamepad !== undefined) {
				if (gamepad.timestamp > lastTimestamp) {
					lastTimestamp = gamepad.timestamp;
					motorsService.desiredSpeed = -100*gamepad.axes[1];
					motorsService.desiredDirection = 100*gamepad.axes[0];
					console.log(gamepad);
				}
			}
		}, 100);
	})

;
