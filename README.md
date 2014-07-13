TTGBot
======

See the Wiki for documentation.

Starting the node server
------------------------

To start the node server, SSH into the robot, browse to the server directory, and enter the following command:

	sudo npm start

This will start the supervisor, which will keep the node application running, and will restart
it if it crashes or if any of the source files change.

To build the front-end files, browse to the public directory (either on the robot or your own computer),
and enter the following command:

	grunt

This will built all front-end files necessary then start watching files for changes, and re-build them when they do
change. It will not build new files, to do that kill the process (Ctrl+C) and run it again.