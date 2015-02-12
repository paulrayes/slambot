var React = require('react');

module.exports = React.createClass({
	render: function() {
		return (
			<div className="panel panel-default">
				<div className="panel-heading">
					<h3 className="panel-title">Air Quality</h3>
				</div>
				<div className="panel-body">
					<p>Idle...</p>
					<p>
						Last 3 readings:<br />
						<strong>300</strong> (30s ago)<br />
						<strong>350</strong> (1m ago)<br />
						<strong>210</strong> (2m ago)
					</p>
					<p>All readings in particles per cactus</p>
				</div>
			</div>
		);
	}
});
