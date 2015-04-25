import time
import serial
import Adafruit_BBIO.GPIO as GPIO

STOP_COMMAND = "\xA5\x25"
RESET_COMMAND = "\xA5\x40"
SCAN_COMMAND = "\xA5\x20"
FORCE_SCAN_COMMAND = "\xA5\x21"

GPIO.setup("P8_36", GPIO.OUT)
GPIO.output("P8_36", GPIO.HIGH)

print "connecting"
ser = serial.Serial('/dev/ttyO5', 115200, timeout=0)
time.sleep(2)

print "resetting"
ser.write(RESET_COMMAND)
time.sleep(5)

print "starting scan"
ser.write(SCAN_COMMAND)
time.sleep(5)

while True:
	data = ser.read(9999)
	if len(data) > 0:
		print "Recv: ", data
	time.sleep(0.1)

print "quitting"
GPIO.output("P8_36", GPIO.LOW)
