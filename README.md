# Glucoled

Silly hack project that loads glucose data from Nightscout and changes the color of a LED fan inside a computer accordingly. 

Running the script:

sudo nodejs glucoled.js nightscouthost.herokuapp.com
 
* Uses https://www.npmjs.com/package/rpi-ws281x to as the LED driver for Node
* For wiring, see https://tutorials-raspberrypi.com/connect-control-raspberry-pi-ws2812-rgb-led-strips/

IF wiring inside a computer, soldering a custom cable is relatively simple. Standard computer power supply units output 12 and 5 volt currencies and both the Pi and fans use 5 volts. I had a Molex fan adapter cable handly, so adapter the instructions from the above link and used the red/black wires from the Molex as the power supply. Pi expects to be powered from the USB port, so this adapter included a micro-USB cable soldered to the same 5 volts.

![The board with cabling](IMG_6625.jpeg)

![Fan showing low](IMG_6626.jpeg)
