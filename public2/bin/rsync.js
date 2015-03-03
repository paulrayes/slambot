var shell = require('shelljs');

//var secret = require('./../secret.js');

/*var command = 'rsync -vW -e "sshpass -p ' + secret.password + ' ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null -c arcfour" --progress --recursive --exclude=.git* ' +
	'--exclude=node_modules ./../robot/ ubuntu@' + secret.sshHost + ':' + secret.sshPath;*/

shell.config.fatal = true;

//shell.exec(command);

//shell.exec('mkdir -p ../mnt');
//shell.exec('sshfs ubuntu@' + secret.sshHost + ':' + secret.sshPath + '../mnt');
shell.exec('rsync -v --progress --recursive --exclude=.git* ./../robot/ ../mnt');
shell.exec('rsync -v --progress --recursive --exclude=.git* ./../repos/ ../mnt/node_modules');
//shell.exec('rsync -v --progress --recursive --exclude=.git* --exclude=node_modules ./../robot/ ../mnt');
