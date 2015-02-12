var React = require('react');

var KnownMap = require('./KnownMap');

// Height and width of the map used by the store
var mapHeight = 125;
var mapWidth = 125;

module.exports = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Map</h3>
				</div>
				<div className="panel-body">
					<svg version="1.1"
							baseProfile="full"
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							viewBox="-5 -5 135 135">
						<KnownMap width={mapWidth} height={mapHeight} />
					</svg>
				</div>
			</div>
		);
	}
});
