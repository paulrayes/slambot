var secret = require('./../secret.js');

var command = 'ssh -o StrictHostKeyChecking=no -o' +
	'UserKnownHostsFile=/dev/null root@' + secret.sshHost;

console.log('================================================');
console.log('Run the following command to SSH into the robot:');
console.log('');
console.log(command);
console.log('================================================');
console.log('');
