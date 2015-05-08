var React = require('react');

module.exports = React.createClass({
	shouldComponentUpdate: function(nextProps) {
		// Lidar readings will never change after the fact
		return false;
	},
	render: function() {
		// Basic artihmetic involving pythagorean theorem
		var mapHeight = this.props.height;
		var mapWidth = this.props.width;
		var _this = this;
		var rects = {};
		var key = 0;
		this.props.readings.forEach(function(reading) {
			var angle = (reading.angle - 90)*Math.PI/180;
			var x = reading.distance*Math.cos(angle)/10;
			var y = reading.distance*Math.sin(angle)/10;
			rects['angle-' + key] = <rect x={x} y={y} width="0.5" height="0.5" />;
			key++;
		});

		return (
			<g>
				{rects}
			</g>
		);
	}
});
