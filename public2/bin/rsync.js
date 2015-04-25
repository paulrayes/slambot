var shell = require('shelljs');

var secret = require('./../secret.js');

/*var command = 'rsync -vW -e "sshpass -p ' + secret.password + ' ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null -c arcfour" --progress --recursive --exclude=.git* ' +
	'--exclude=node_modules ./../robot/ ubuntu@' + secret.sshHost + ':' + secret.sshPath;*/

shell.config.fatal = true;

//shell.exec(command);

//shell.exec('rsync -v --progress --recursive --exclude=.git* --exclude=node_modules ./../robot/ ../mnt');
//shell.exec('rsync -v --progress --recursive --exclude=.git* ./../repos/ ../mnt/node_modules');
/*shell.exec('rsync -vW -e "sshpass -p ' + secret.password + ' ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null -c arcfour" --progress --recursive --exclude=.git* ' +
	'--exclude=node_modules ./../robot/ ubuntu@' + secret.sshHost + ':' + secret.sshPath);*/
/* Ubuntu rev b:
shell.exec('rsync -vW -e "sshpass -p ' + secret.password + ' ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null -c arcfour" --progress --recursive --exclude=.git* ' +
	'--exclude=node_modules ./../robot/ ubuntu@' + secret.sshHost + ':' + secret.sshPath);*/
/* Debian rev c: */
var start = Date.now();
/*shell.exec('rsync -aWu ' +
	' --progress --recursive --exclude=.git* ' +
	'--exclude=node_modules ./../robot/ root@' + secret.sshHost + ':' + secret.sshPath, function() {
		console.log(Date.now() - start);
	});*/
shell.exec('rsync -aWuv -e "ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null -c arcfour" --progress --recursive --exclude=.git* ' +
	'--exclude=node_modules ./../robot/ root@' + secret.sshHost + ':' + secret.sshPath, function() {
		console.log('Uploaded in ' + (Date.now() - start)/1000 + ' seconds');
	});
/*shell.exec('rsync -vW -e "sshpass -p ' + secret.password + ' ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null -c arcfour" --progress --recursive --exclude=.git* ' +
	'--exclude=node_modules ./../repos/ ubuntu@' + secret.sshHost + ':' + secret.sshPath + '/node_modules');*/
