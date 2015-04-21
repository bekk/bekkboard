#include <RFduinoBLE.h>

int led_r = 2; // pin 2 on is RGB shield red led
int led_g = 3; // pin 3 on is RGB shield green led
int led_b = 4; // pin 4 on is RGB shield blue led

int button_a = 5;
int button_b = 6;

void setup()
{
  Serial.begin(9600);
  Serial.println("waiting for connection...");

  pinMode(led_r, OUTPUT);
  pinMode(led_g, OUTPUT);
  pinMode(led_b, OUTPUT);

  pinMode(button_a, INPUT);
  pinMode(button_b, INPUT);

  RFduino_pinWake(button_a, HIGH);
  RFduino_pinWake(button_b, HIGH);

  RFduinoBLE.deviceName = "pingis";
  RFduinoBLE.advertisementData = "pingpong";

  // TODO try lower tx power
  // RFduinoBLE.txPowerLevel = -10;

  RFduinoBLE.begin();
}

int previousA;

void loop()
{
  digitalWrite(led_g, LOW);

  Serial.println("sleeping");
//
//  Serial.println(digitalRead(button_a));
//  Serial.println(digitalRead(button_b));
//  Serial.println("--");
//  return;

  RFduino_ULPDelay(INFINITE);
  //RFduino_systemOff();

  digitalWrite(led_g, HIGH);

  Serial.println(digitalRead(button_a));
  Serial.println(digitalRead(button_b));

  if (RFduino_pinWoke(button_a)) {
    Serial.println("awoke from pin 5");
    RFduinoBLE.sendInt(0);
    delay(500);
  }

  if (RFduino_pinWoke(button_b)) {
    Serial.println("awoke from pin 6");
    RFduinoBLE.sendInt(1);
    delay(500);
  }
  RFduino_resetPinWake(button_a);
  RFduino_resetPinWake(button_b);
}

void RFduinoBLE_onAdvertisement(bool start)
{
  if (start)
  {
    digitalWrite(led_b, HIGH);
    Serial.println("advertising");
  }
  else
  {
    digitalWrite(led_b, LOW);
    Serial.println("stopped advertising");
  }
}

/* void advertise(const char *data, uint32_t ms) */
/* { */
/*   RFduinoBLE.begin(); */
/*   RFduino_ULPDelay(1000); */
/*   RFduinoBLE.end(); */
/* } */

/* void RFduinoBLE_onConnect() */
/* { */
/* } */

/* void RFduinoBLE_onDisconnect() */
/* { */
/* } */

// returns the dBm signal strength indicated by the receiver after connection (-0dBm to -127dBm)
/* void RFduinoBLE_onRSSI(int rssi) */
/* { */
/*   Serial.print(rssi); */
/*   Serial.print("dBm"); */
/*   Serial.println(); */
/* } */

/* void RFduinoBLE_onReceive(char *data, int len) */
/* { */
/* } */



