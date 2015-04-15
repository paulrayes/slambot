var React = require('react');

module.exports = React.createClass({
	shouldComponentUpdate: function() {
		return false;
	},
	render: function() {
		return (
			<footer className="footer">
				<div className="container">
					<div className="footer-inner">
						<p>
							TTGBot is the senior design project of Vanessa Martinez, Paul Rayes, Josh Montes, and Vu Truong<br />
							School of Electrical, Computer and Energy Engineering | Ira A. Fulton Schools of Engineering | Arizona State University<br />
							Back-end/Robot: <a href="http://nodejs.org/">Node.js</a> on a <a href="http://beagleboard.org/black">BeagleBone Black</a><br />
							Front-end: <a href="http://facebook.github.io/react/">ReactJS</a> and <a href="http://getbootstrap.com">Bootstrap</a>
						</p>
					</div>
				</div>
			</footer>
		);
	}
});
