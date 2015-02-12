Algorithms
==========

These are algorithms to calculate various things

Each algorithm should be its own file

## [ ] IMU

- [x] Get the raw values from the IMU
- [ ] Convert them to whatever units they should be in

## [ ] LIDAR

- [ ] Get the raw values from the LIDAR
- [ ] Group a set of 360deg readings into one reading object

## [ ] Orientation

This is an innacurate estimate for right now, the process of calculating our exact position could also calculate an orientation

[ ] TODO move this to its own module, it's in the IMU one right now

- [x] Get magnetic fields from IMU
- [x] Use atan2 to calculate orientation

## [ ] Pose

This only works if we already know the map around is, right now that's always the case.

The first time we run this, assume we're in that bottom left corner of our environment, with the long hallway and dead end, facing away from the dead end towards the bend and opening.

This should also calculate our exact orientation?

- [ ] Get the estimated position
- [ ] Get the raw LIDAR readings
- [ ] Get our orientation
- [ ] Figure out where we expect two walls to be that are at least 15cm away, somewhat long, and that are perpendicular to each other (or more than two if that's easier, not sure), we know our orientation and estimated position so we know roughly what direction we expect those walls to be
- [ ] See how far away those walls actually are using the LIDAR data. 
- [ ] Calculate the orientation of those walls relative to us, or our orientation relative to those walls (do we need to do this?)
- [ ] Knowing the exact position of those walls, our distance from them, and our orientation relative to them, calculate our position relative to them
- [ ] Create a pose, this contains the following:
	- Orientation
	- Position
	- Raw LIDAR readings

## [ ] Pose: Obstacle positions

*Corrected* is the wrong word to use, what's the right word? dunno, can't think, need sleep

This works on a pose to give point positions of obstacles. For now this will probably just be used to draw the LIDAR readings on the map.

- [ ] Given a pose with LIDAR readings relative to robot for position and angles:
- [ ] Add/subtract angle from LIDAR readings to get distances that are relative to the robot's position but relative to environment for angle
- [ ] Convert to x,y coordinates with robot at origin
- [ ] Add robot's position to get x,y coordinates relative to environment (may or may not need to do this?)

## [ ] Estimated Position

- [ ] Initialize with some initial position and set initial speed to zero
- [ ] Record initial time
- [ ] Repeat forever in the background, the more often this runs the more accurate it should be:
	- Get our orientation
	- Get the speed from optical encoders or IMU
	- Use the time since last loop to calculate distance traveled

## [ ] Air Quality

- [ ] Get reading from sensor
- [ ] Convert to particles per cactus
- [ ] Save value in our most recent pose
