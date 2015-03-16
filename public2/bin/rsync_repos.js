var shell = require('shelljs');

var secret = require('./../secret.js');

shell.config.fatal = true;

shell.exec('rsync -vW -e "sshpass -p ' + secret.password + ' ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null -c arcfour" --progress --recursive --exclude=.git* ' +
	'--exclude=node_modules ./../repos/ ubuntu@' + secret.sshHost + ':' + secret.sshPath + '/node_modules');
