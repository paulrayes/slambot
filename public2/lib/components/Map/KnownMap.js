// Component that 
var React = require('react');

var KnownMapStore = require('../../stores/KnownMapStore');

module.exports = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		// No need to redraw, ever
		return false;
	},
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
				<rect x={x} y={y} width={width} height={height} />
			);

			key++;
		});
		var grids = KnownMapStore.getGrid();
		var gridDots = {};
		var x = 0;
		var y = 0;
		for (x = -50; x < grids.length; x = x + 10) {
			for (y = -50; y < grids[x].length; y = y + 10) {
				if (grids[x][y] === 1) {
					gridDots['pos-' + x + '-' + y] = <rect x={x/10} y={(grids[x].length-y)/10} width="0.5" height="0.5" />;
				}
			}
		}

		return (
			<g>
			<g fill="#DDD">{wallLines}</g>
			{/*<g fill="#000">{gridDots}</g>*/}
			</g>
		);
	}
});
