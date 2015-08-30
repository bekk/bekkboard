#include <RFduinoGZLL.h>

device_t role = HOST;

void setup()
{
  Serial.begin(9600);
  // start the GZLL stack  
  RFduinoGZLL.begin(role);
}

void loop()
{
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{
  char state = data[0];
  switch (state) {
    case 0: // Button A single click
      Serial.println("0");
      break;
    case 1: // Button B single click
      Serial.println("1");
      break;
    case 2: // Button A double click
      Serial.println("2");
      break;
    case 3: // Button B double click
      Serial.println("3");
      break;
    case 4: // Button A long press
      Serial.println("4");
      break;
    case 5: // Button B long press
      Serial.println("5");
      break;
  }
  

  // no data to piggyback on the acknowledgement sent back to the Device
  // RFduinoGZLL.sendToDevice(device, "OK");
}
