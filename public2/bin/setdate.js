//var shell = require('shelljs');
var secret = require('./../secret.js');

//shell.config.fatal = true;

var command = 'sshpass -p ' + secret.password +  ' ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null ubuntu@' + secret.sshHost + ' \'date --set=' + Date.now() + '\'';

//shell.exec(command);

console.log('================================================');
console.log('Run the following command to set the date of the robot:');
console.log('');
console.log(command);
console.log('================================================');
console.log('');
