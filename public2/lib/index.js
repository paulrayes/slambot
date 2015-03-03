var React = require('react');

var Header = require('./components/Header');
var Footer = require('./components/Footer');
var Map = require('./components/Map/Map');
var SpeedVisualization = require('./components/SpeedVisualization');
var OverallSpeed = require('./components/OverallSpeed');
var MotorSpeed = require('./components/MotorSpeed');
var EnableFlags = require('./components/EnableFlags');
var Webcam = require('./components/Webcam');
var IMU = require('./components/IMU');
var AirQuality = require('./components/AirQuality');

React.render(
	(
		<div>
			<Header />
			<div className="container-fluid">
				<div className="row">
					<div className="col-sm-3">
						<SpeedVisualization />
						<OverallSpeed />
						<MotorSpeed />
						<EnableFlags />
					</div>
					<div className="col-sm-5">
						<Map />
					</div>
					<div className="col-sm-4">
						<Webcam />
						<IMU />
						<AirQuality />
					</div>
				</div>
			</div>
			<Footer />
		</div>
	),
	document.getElementById('content')
);
