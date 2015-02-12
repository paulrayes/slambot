var React = require('react');

var MotorStore = require('../stores/MotorStore');

// Height and width of the map used by the store
var mapHeight = 125;
var mapWidth = 125;

/*MotorStore.on('change', function() {
	console.log(MotorStore.desiredSpeed);
});*/

var Arrow = React.createClass({
	getDefaultProps: function() {
		return {
			length: 20,
			angle: 0,
			stroke: '#000',
			strokeWidth: '1'
		}
	},
	render: function() {
		var y = 50 - this.props.length;
		var transform = 'rotate(' + this.props.angle + ' 50 50)';
		var xTailLength = this.props.strokeWidth*2;
		var yTailLength = this.props.strokeWidth*3;
		return (
			<g transform={transform} stroke={this.props.stroke} strokeWidth={this.props.strokeWidth}>
				<line x1="50" y1="50" x2="50" y2={y-0.5} />
				<line x1="50" y1={y} x2={50+xTailLength} y2={y+yTailLength} />
				<line x1="50" y1={y} x2={50-xTailLength} y2={y+yTailLength} />
			</g>
		);
	}
});

module.exports = React.createClass({
	getInitialState: function() {
		return MotorStore.data;
	},
	componentDidMount: function() {
		MotorStore.on('change', this.onChange);
	},
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Speed Visualization</h3>
				</div>
				<div className="panel-body">
					<svg version="1.1"
							baseProfile="full"
							xmlns="http://www.w3.org/2000/svg"
							width="50%" className="center-block"
							viewBox="0 0 100 100">
						<rect x="40" y="30" width="20" height="40" fill="#CCC" stroke="#999" />
						<Arrow length={this.state.actualSpeedLength/2} angle={this.state.actualAngle} stroke="#555" strokeWidth="2" />
						<Arrow length={this.state.desiredSpeedLength/2} angle={this.state.desiredAngle} stroke="#C00" strokeWidth="2" />
					</svg>
				</div>
			</div>
		);
	},
	onChange: function() {
		this.setState(MotorStore.data);
	}
});
