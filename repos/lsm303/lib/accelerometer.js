var i2c = require('i2c');
var utils = require('./util');

var accel_address = 0x19;
var accel_device = '/dev/i2c-1'
// Resolution: 0: +/- 2G, 1: +/- 4G, 2: +/- 8G, 3: +/- 16G
var resolution = 3;

function Accelerometer(options) {
    if (options && options.address) {
        accel_address = options.address;
    }
    if (options && options.device) {
        accel_device = options.device;
    }
    if (options && options.resolution) {
        resolution = options.resolution;
    }
    this.accel = new i2c(accel_address, {
        device: accel_device,
        debug: false
    });
    this.init();
    this.setResolution();
}
Accelerometer.prototype.init = function(){
    this.accel.writeBytes(0x20, [0x57], function(err) {
        if(err){
            console.log("Error enabling Accelerometer : "+err);
        }
        else{
            console.log("Accelerometer Enabled");
        }
    });
}
Accelerometer.prototype.setResolution = function(){
    var val = 0x08 + (resolution << 4);
    this.accel.writeBytes(0x23, [val], function(err) {
        if(err){
            console.log("Error Setting Accelerometer Resolution : "+err);
        }
        else{
            console.log("Accelerometer Resolution Set to ", resolution.toString(2));
        }
    });
}
Accelerometer.prototype.readAxes = function(callback){
    this.accel.readBytes(0x28 | 0x80, 6, function(err, res) {
        callback(err,utils.buffToXYZAccel(res));
    });
}
module.exports = Accelerometer;
