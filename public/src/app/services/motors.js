angular.module('ngBoilerplate.motorsService', [
		'ngBoilerplate.socketService'
	])
	.factory('motorsService', function($rootScope, socketService) {
		'use strict';

		// Speeds are relative to a theoretical maximum speed and thus an actual speed of -50 or 50 is not likely.
		// But, that's pretty fast so msot of the time we'll probably have a desired speed of less than that.

		// Number from -50 (backwards) to 50 (forwards), 0 is stopped
		var _desiredSpeed = 0;
		// Number from -50 (left) to 50 (right), 0 is straight
		var _desiredDirection = 0;

		var _actualSpeed = 0;
		var _actualDirection = 0;

		// Object represents a single motor
		var Motor = {
			desiredSpeed: 0,
			actualSpeed: 0,
			actualRpm: 0
		};



		var motorsService = {
			left: Object.create(Motor),
			right: Object.create(Motor),

			get desiredSpeed() {
				return _desiredSpeed;
			},
			set desiredSpeed(value) {
				_desiredSpeed = -value/2;
				this.updateMotors();
			},
			get desiredDirection() {
				return _desiredDirection;
			},
			set desiredDirection(value) {
				_desiredDirection = -value/2;
				this.updateMotors();
			},
			get actualSpeed() {
				return _actualSpeed;
			},
			get actualDirection() {
				return _actualDirection;
			},

			updateMotors: function() {

				socketService.emit('motors:update', {
					desiredSpeed: _desiredSpeed,
					desiredDirection: _desiredDirection
				});

				$rootScope.$apply();
			}

		};


		socketService.on('motors:update', function(data) {
			console.debug(data);
			_desiredSpeed = data.desiredSpeed;
			_desiredDirection = data.desiredDirection;

			_actualSpeed = data.actualSpeed;
			_actualDirection = data.actualDirection;

			motorsService.left.desiredSpeed = data.left.desiredSpeed;
			motorsService.left.actualSpeed = data.left.actualSpeed;
			motorsService.left.actualRpm = data.left.actualRpm;

			motorsService.right.desiredSpeed = data.right.desiredSpeed;
			motorsService.right.actualSpeed = data.right.actualSpeed;
			motorsService.right.actualRpm = data.right.actualRpm;

			$rootScope.$apply();
		}.bind(this));

		return motorsService;

	});
