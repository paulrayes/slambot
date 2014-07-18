TTGBot
======

See the Wiki for documentation.

Starting the node server
------------------------

To build the front-end files, browse to the public directory (either on the robot or your own computer),
and enter the following command:

	grunt watch

This will built all front-end files necessary then start watching files for changes, and re-build them when they do
change. It will not build new files, to do that kill the process (Ctrl+C) and run it again. It will also upload the
server files to the robot, and re-upload them when they change. Some errors may be written here so keep it visible.

To start the node server, SSH into the robot, browse to the server directory, and enter the following command:

	sudo npm start

This will start the supervisor, which will keep the node application running, and will restart
it if it crashes or if any of the source files change. Any errors encountered will be written here, along with debug
information, so keep it visible.

Finally there is a web server that runs on your local machine and serves the files for the front-end; if you already
have a web server set up on your computer you can use that, otherwise enter the following command to start it from the
public directory:

	node httpServer.js
