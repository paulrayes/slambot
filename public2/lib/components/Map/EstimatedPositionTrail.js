// Component that maps the estimated position
var React = require('react');

var EstimatedPositionStore = require('../../stores/EstimatedPositionStore');

// Getting an initial position
module.exports = React.createClass({
	getInitialState: function() {
		return {
			points: EstimatedPositionStore.getAll()
		};
	},

	// Changing the estimated position
	componentDidMount: function() {
		EstimatedPositionStore.on('change', this.onChange);
	},
	render: function() {
		var mapHeight = this.props.height;
		var mapWidth = this.props.width;
//console.log(EstimatedPositionStore.data);
		// Get the wall positions from the store and create SVG elements for
		// each of them.
		var points = this.state.points;
		var lines = {};
		var key = 0;
		prevPoint = points[0];
		points.forEach(function(point) {

			// Our map has the origin at the bottom left, SVG wants it in the
			// top left, so need to convert all y values
			//var y = mapHeight - Math.min(wall[0][1], wall[1][1]) - height;
			var x1 = prevPoint.x;//+mapWidth/2;
			var y1 = mapHeight - prevPoint.y;//+mapHeight/2;
			var x2 = point.x;//+mapWidth/2;
			var y2 = mapHeight - point.y;//+mapHeight/2;

			// Finally create the SVG element
			lines['wall-' + key] = (
				<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#63C" strokeWidth="0.5" />
			);

			prevPoint = point;
			key++;
		});

		return (
			<g>
				{lines}
			</g>
		);
	},
	onChange: function() {
		this.setState(EstimatedPositionStore.getAll());
	}
});
