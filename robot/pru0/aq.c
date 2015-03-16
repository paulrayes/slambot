/** Program to load a PRU program that flashes an LED until a button is
*   pressed. By Derek Molloy, for the book Exploring BeagleBone
*   based on the example code at:
*   http://processors.wiki.ti.com/index.php/PRU_Linux_Application_Loader_API_Guide
*/

#include <stdio.h>
#include <stdlib.h>
#include <prussdrv.h>
#include <pruss_intc_mapping.h>

#define PRU_NUM	0   // using PRU0 for these examples

int main (void)
{
   if(getuid()!=0){
      printf("You must run this program as root. Exiting.\n");
      exit(EXIT_FAILURE);
   }
   // Initialize structure used by prussdrv_pruintc_intc
   // PRUSS_INTC_INITDATA is found in pruss_intc_mapping.h
   tpruss_intc_initdata pruss_intc_initdata = PRUSS_INTC_INITDATA;

   // Allocate and initialize memory
   prussdrv_init ();
   prussdrv_open (PRU_EVTOUT_0);

   // Write a single word into PRU0 Data RAM0
   //unsigned int pru0 = 0xFEEDBBB0;
   //prussdrv_pru_write_memory(PRUSS0_PRU0_DATARAM, 0, &pru0, 4);
   //unsigned int pru1 = 0xFEEDBBB1;
   //prussdrv_pru_write_memory(PRUSS0_PRU1_DATARAM, 0, &pru1, 4);
   //unsigned int pruins0 = 0xFEEDBBB2;
   //prussdrv_pru_write_memory(PRUSS0_PRU0_IRAM, 0, &pruins0, 4);
   //unsigned int pruins1 = 0xFEEDBBB3;
   //prussdrv_pru_write_memory(PRUSS0_PRU1_IRAM, 0, &pruins1, 4);

   // Map PRU's interrupts
   prussdrv_pruintc_init(&pruss_intc_initdata);

   // Load and execute the PRU program on the PRU
   prussdrv_exec_program (PRU_NUM, "./aq.bin");

   // Wait for event completion from PRU, returns the PRU_EVTOUT_0 number
   int n = prussdrv_pru_wait_event (PRU_EVTOUT_0);
   printf("EBB PRU program completed, event number %d.\n", n);

   // Disable PRU and close memory mappings
   prussdrv_pru_disable(PRU_NUM);
   prussdrv_exit ();
   return EXIT_SUCCESS;
}
