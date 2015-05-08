// This component display the last several readings of air quality.
var React = require('react');

var Chart = require('chart.js');

var AqStore = require('../stores/AqStore');

module.exports = React.createClass({
	getInitialState: function() {
		return {readings: AqStore.data, chart: undefined};
	},
	componentDidMount: function() {
		AqStore.on('change', this.onChange);
		//setInterval(this.onChange, 1000);
		var ctx = this.refs.canvas.getDOMNode().getContext("2d");
		//var myNewChart = new Chart(ctx).PolarArea(data);
		this.setState({chart: new Chart(ctx).Line({
			labels: [],
			datasets: [{
				label: 'M pcs/m3',
				fillColor: "rgba(220,220,220,0.2)",
				strokeColor: "rgba(220,220,220,1)",
				pointColor: "rgba(220,220,220,1)",
				pointStrokeColor: "#fff",
				pointHighlightFill: "#fff",
				pointHighlightStroke: "rgba(220,220,220,1)",
				data: []
			}]
		}, {
			bezierCurve: false,
			scaleShowVerticalLines: false,
			animation: false,
			showTooltips: false,
			responsive: true
		})});
	},
	render: function() {
		var rows = [];
		var key = 0;
		var aqiBackgroundColors = ['#00e400', '#ff0', '#ff7e00', '#f00', '#99004c', '#7e0023'];
		var aqiColors = ['black', 'black', 'black', 'white', 'white', 'white'];
		this.state.readings.forEach(function(reading) {
			key++;
			if (typeof reading === 'undefined') {
				return;
			}
			var particles = Math.round(reading.particles/1000)/1000;
			var time = Math.round((Date.now() - reading.unix)/1000);
			if (time < 300) {
				time = time + 's ago';
			} else {
				var date = new Date(reading.unix);
				var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
				var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
				var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
				time = hours + ':' + minutes + ':' + seconds;
			}
			var style = {
				background: aqiBackgroundColors[reading.aqiIndex],
				color: aqiColors[reading.aqiIndex]
			};
			rows.push(<span key={'row-'+key}><strong style={style}>{particles}</strong> ({time})<br /></span>);
		});
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Air Quality</h3>
				</div>
				<div className="panel-body">
					<canvas width="400" height="200" ref="canvas"></canvas>
					<p>
						{rows}
					</p>
					<p>All readings in<br />M pcs/m3 (>= 1um)</p>
				</div>
				{/*<table className="table table-bordered" style={{width:'100%'}}>
					<tr>
						<th style={{width:'50%'}}>Particles</th>
						<th style={{width:'50%'}}>AQI</th>
					</tr>
					<tr>
						<th>{this.state.data.particles}Acceleration (m/s<sup>2</sup>)<br /><small>referenced to robot</small></th>
						<td>{this.state.data.particles}</td>
					</tr>
					<tr>
						<th>Acceleration (m/s<sup>2</sup>)<br /><small>referenced to earth</small></th>
						<td>{this.state.accelTranslated.x}</td>
						<td>{this.state.accelTranslated.y}</td>
						<td></td>
					</tr>
					<tr>
						<th>Speed (m/s)<br /><small>referenced to earth</small></th>
						<td>{this.state.speed.x}</td>
						<td>{this.state.speed.y}</td>
						<td></td>
					</tr>
					<tr>
						<th>Position (m)<br /><small>referenced to earth</small></th>
						<td>{this.state.estimatedPosition.x}</td>
						<td>{this.state.estimatedPosition.y}</td>
						<td></td>
					</tr>
					<tr>
						<th>Magnetic Fields</th>
						<td>{this.state.mag.x}</td>
						<td>{this.state.mag.y}</td>
						<td>{this.state.mag.z}</td>
					</tr>
					<tr>
						<th>Angular Velocity</th>
						<td>{this.state.gyro.x}</td>
						<td>{this.state.gyro.y}</td>
						<td>{this.state.gyro.z}</td>
					</tr>
				</table>*/}
			</div>
		);
	},
	onChange: function() {
		var readings = AqStore.data;
		//this.setState({readings: readings});
		/*var oldLength = this.state.chart.datasets[0].points.length;
		if (oldLength === readings.length) {
			return;
		}*/
		var reading = {};
		var particles = 0;
		var date = new Date();
		var hours = 0;
		var minutes = 0;
		var seconds = 0;
		var time = '';
		var all = this.state.readings;
		if (readings.length) {
			all = readings;
		} else {
			all.unshift(readings);
			readings = [readings];
		}
		for (var i = readings.length-1; i >= 0; i--) {
			reading = readings[i];
			particles = Math.round(reading.particles/1000)/1000;
			date = new Date(reading.unix);
			hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
			minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
			seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
			time = hours + ':' + minutes + ':' + seconds;
			//console.log(this.state.chart.datasets[0].points.length);
			this.state.chart.addData([particles], time)
			console.log('add ' + particles + ' at ' + time);
		}
		//this.state.chart
		this.setState({readings: all});
	}
});
