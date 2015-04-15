var shell = require('shelljs');

var secret = require('./../secret.js');

shell.config.fatal = true;

shell.exec('rsync -vW -e "ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null -c arcfour" --progress --recursive --exclude=.git* ' +
	'./../repos/ root@' + secret.sshHost + ':' + secret.sshPath + '/node_modules');
