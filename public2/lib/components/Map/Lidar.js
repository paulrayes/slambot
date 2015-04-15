var React = require('react');

var EstimatedPositionStore = require('../../stores/EstimatedPositionStore');
var LidarStore = require('../../stores/LidarStore');
var LidarReading = require('./LidarReading');


module.exports = React.createClass({
	shouldComponentUpdate: function(nextProps, nextState) {
		return !(nextState.data === this.state.data);
	},
	getInitialState: function() {
		return {
			prevData: [],
			data: LidarStore.data,
			position: EstimatedPositionStore.data
		};
	},
	componentDidMount: function() {
		LidarStore.on('change', this.onChange);
		EstimatedPositionStore.on('change', this.onChange);
	},
	render: function() {
		var things = {};
		//var transform='translate(' + this.props.width/2 + ',' + this.props.height/2 + ')';
		var transform='translate(' + this.state.position.x + ',' + (this.props.height-this.state.position.y) + ')';

		this.state.prevData.forEach(function(data) {
			if (typeof data === 'undefined' || data.count < 0) {
				return;
			}
			things['reading-' + data.count] = <g fill="#C99"><LidarReading count={data.count} readings={data.readings} prev={true} /></g>;
		});

		things['reading-' + this.state.data.count] = <g fill="#C36"><LidarReading count={this.state.data.count} readings={this.state.data.readings} prev={false} /></g>;

		return (
			<g transform={transform}>
				{things}
			</g>
		);
	},
	onChange: function() {
		this.setState({
			prevData: [
				this.state.data,
				this.state.prevData[0],
				this.state.prevData[1],
				this.state.prevData[2],
				this.state.prevData[3]
			],
			data: LidarStore.data,
			position: EstimatedPositionStore.data
		});
	}
});
