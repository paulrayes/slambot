var shell = require('shelljs');

var secret = require('./../secret.js');

shell.config.fatal = true;

console.log('sudo umount -l ../mnt');
console.log('mkdir -p ../mnt');
console.log('sshfs ubuntu@' + secret.sshHost + ':' + secret.sshPath + ' ../mnt');
