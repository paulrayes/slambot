var React = require('react');

var KnownMap = require('./KnownMap');
var EstimatedPositionTrail = require('./EstimatedPositionTrail');
var Landmarks = require('./Landmarks');
var Lidar = require('./Lidar');
var MapCursorPosition = require('./MapCursorPosition');

// Height and width of the map used by the store
var mapHeight = 125;
var mapWidth = 125;

function getPosition(element) {
	var xPosition = 0;
	var yPosition = 0;

	while(element) {
		xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
		element = element.offsetParent;
	}
	return { x: xPosition, y: yPosition };
}

module.exports = React.createClass({
	getInitialState: function() {
		return {
			cursor: {
				x: 0,
				y: 0
			}
		};
	},
	onMouseMove: function(e) {
		var svg = this.refs.svg.getDOMNode();
		var svgPosition = getPosition(svg);
		var point = svg.createSVGPoint();
		point.x = e.pageX;// - svgPosition.x;
		point.y = e.pageY;// - svgPosition.y;
		var transformed = point.matrixTransform(svg.getScreenCTM().inverse());
		this.setState({
			cursor: transformed
		});
	},
	onMouseEnter: function() {
		this.setState({
			cursorPositionVisible: true
		});
	},
	onMouseLeave: function() {
		this.setState({
			cursorPositionVisible: false
		});
	},
	render: function() {
		var cursorPosElem = null;
		if (this.state.cursorPositionVisible) {
			cursorPosElem = <MapCursorPosition width={mapWidth} height={mapHeight} cursor={this.state.cursor} />;
		}
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
							viewBox="-5 -5 135 135"
							ref="svg"
							onMouseMove={this.onMouseMove}
							onMouseEnter={this.onMouseEnter}
							onMouseLeave={this.onMouseLeave}>
						<KnownMap width={mapWidth} height={mapHeight} />
						<EstimatedPositionTrail width={mapWidth} height={mapHeight} />
						{/*<Landmarks width={mapWidth} height={mapHeight} />*/}
						<Lidar width={mapWidth} height={mapHeight} />
						{cursorPosElem}
					</svg>
				</div>
			</div>
		);
	}
});
