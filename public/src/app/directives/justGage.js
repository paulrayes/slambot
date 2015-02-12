angular.module('ngBoilerplate.directives', [])
	.directive('ttgJustGage', ['$timeout', function ($timeout) {
		'use strict';
		return {
			restrict: 'E',
			scope: {
				id: '@',
				class: '@',
				min: '=',
				max: '=',
				title: '@',
				value: '='
			},
			template: '<div id="{{id}}-justgage" class="{{class}}"></div>',
			link: function (scope) {
				$timeout(function () {
					var g = new JustGage({
						id: scope.id + '-justgage',
						min: scope.min,
						max: scope.max,
						title: scope.title,
						value: scope.value,
						refreshAnimationTime: 150,
						levelColors: [ '#d9534f', '#5bc0de', '#d9534f' ]
					});

					scope.$watch('value', function (updatedValue) {
						g.refresh(updatedValue);
					}, true);
				});
			}
		};
	}]);
