var React = require('react');

var version = require('../../package.json').version;

module.exports = React.createClass({
	render: function() {
		return (
			<div className="navbar navbar-inverse navbar-fixed-top">
				<div className="container">
					<div className="navbar-header">
						<a className="navbar-brand">TTGBot <small>v{version}</small></a>
					</div>
					<p className="navbar-text navbar-right">
						Load: x
						| CPU: x %
						| RAM: x MB
					</p>
				</div>
			</div>
		);
	}
});
