/*
This sketch demonstrates how to send data from a Device
to a Host in a Gazell network.

The host and upto 3 devices should have the RGB shield
attached.  When Button A on a Device is pressed, the
associated led on the Host will toggle.  Device1 is
associated with the Red led, Device2 with the Green led
and Device3 with the Blue led.

The Green led on the Device will blink to indicate
that an acknowledgement from the Host was received.
*/

#include <RFduinoGZLL.h>

device_t role = HOST;

// pin for the Green Led
int led_r = 2; // pin 2 on is RGB shield red led
int led_g = 3; // pin 3 on is RGB shield green led
int led_b = 4; // pin 4 on is RGB shield blue led

void setup()
{
  Serial.begin(9600);
  pinMode(led_r, OUTPUT);
  pinMode(led_g, OUTPUT);
  pinMode(led_b, OUTPUT);

  // start the GZLL stack  
  RFduinoGZLL.begin(role);
}

void loop()
{
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{
  char state = data[0];
  switch(state){
    case 0:
    Serial.println("0");
    digitalWrite(led_r, HIGH);
    digitalWrite(led_g, LOW);
    break;
    case 1:
    Serial.println("1");
    digitalWrite(led_r, LOW);
    digitalWrite(led_g, HIGH);
    break;
  }
  

  // no data to piggyback on the acknowledgement sent back to the Device
  // RFduinoGZLL.sendToDevice(device, "OK");
}
