// Measures the high occupancy time for the PPD42NS Particulate Matter sensor.
// and saves it to memory. This can then be read from within Linux to calculate
// the ratio and particle count.


.setcallreg r29.w0               // Change the return address register for calls because
                                 // we want to use r30.w0 for outputs
.origin 0                        // start of program in PRU memory
.entrypoint INITIALIZE           // program entry point (for a debugger)

#define INS_PER_US   200         // 5ns per instruction
#define INS_PER_DELAY_LOOP 2     // two instructions per delay loop
                                 // set up a 50ms delay
#define DELAY  50 * 1000 * (INS_PER_US / INS_PER_DELAY_LOOP)

#define PRU0_R31_VEC_VALID 32    // allows notification of program completion
#define PRU_EVTOUT_0    3        // the event number that is sent back

INITIALIZE:
	MOV r0, 0x00000000     // Save the base data memory address
	MOV r3, 14999998       // Number of unit time durations to wait before saving to memory.
	                       // 15000000 is 30 seconds but some time is spent doing other
	                       // things so we use a little less.
	MOV r6, 0x0            // Initialize the number of times we've saved to memory
START:
	MOV r5, 0x0            // Initialize counter for time sensor is high
	MOV r4, 0x0            // Initialize counter for total time for a loop

REPEAT:
	SET r30.t5             // turn the status LED on

AQHIGH:
	QBGE SAVEMEM, r3, r4   // If it's been >= 30 seconds save to memory
	CALL SLEEP             // wait for 1us
	ADD r5, r5, 1          // Add one to the time the sensor is high
	ADD r4, r4, 1          // Add one to the total time
	QBBS AQHIGH, r31.t5    // Loop until AQ sensor reading goes low again

	CLR r30.t5             // turn the status LED off

AQLOW:
	CALL SLEEP             // wait for 1us
	ADD r4, r4, 1          // Add one to the total time
	QBBC AQLOW, r31.t5     // Loop until AQ sensor reading goes high again

	JMP REPEAT              // Go again

SAVEMEM:
	ADD r6, r6, 1
	SBBO r4, r0, 12, 4      // Save total time to memory
	SBBO r5, r0, 8, 4       // Save high time to memory
	SBBO r6, r0, 4, 4       // Save loop counter to memory
	JMP START


// Subroutine to do nothing for one microsecond (1us)
SLEEP:
	MOV r10, 100
SLEEPLOOP:
	SUB r10, r10, 1
	QBNE SLEEPLOOP, r10, 0
	RET
