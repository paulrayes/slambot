var React = require('react');

var KnownMapStore = require('../stores/KnownMapStore');

module.exports = React.createClass({
	render: function() {
		var mapHeight = this.props.height;
		var mapWidth = this.props.width;

		// Get the wall positions from the store and create SVG elements for
		// each of them.
		var walls = KnownMapStore.getWalls();
		var wallLines = {};
		var key = 0;
		walls.forEach(function(wall) {
			// Calculate x, y, width, and height for this wall
			var width = Math.abs(wall[1][0] - wall[0][0]);
			var height = Math.abs(wall[1][1] - wall[0][1]);
			var x = Math.min(wall[0][0], wall[1][0]);

			// Our map has the origin at the bottom left, SVG wants it in the
			// top left, so need to convert all y values
			var y = mapHeight - Math.min(wall[0][1], wall[1][1]) - height;

			// Finally create the SVG element
			wallLines['wall-' + key] = (
				<rect x={x} y={y} width={width} height={height} fill="#666" />
			);

			key++;
		});

		return (
			<g>
				{wallLines}
			</g>
		);
	}
});
