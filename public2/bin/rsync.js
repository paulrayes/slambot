var shell = require('shelljs');

var secret = require('./../secret.js');

var command = 'rsync -avz -e "sshpass -p ' + secret.password + ' ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null" --progress --recursive --delete --exclude=.git* ' +
	'--exclude=node_modules ./../robot/ ubuntu@' + secret.sshHost + ':' + secret.sshPath;

shell.config.fatal = true;

shell.exec(command);
