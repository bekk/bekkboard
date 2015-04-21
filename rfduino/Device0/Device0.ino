#include <RFduinoGZLL.h>
#include "OneButton.h"

device_t role = DEVICE0;

int button_a = 5;
int button_b = 6;

OneButton buttonA(button_a, false);
OneButton buttonB(button_b, false);

void setup()
{
  Serial.begin(9600);
  Serial.println("waiting for connection...");
  RFduino_pinWake(button_a, HIGH);
  RFduino_pinWake(button_b, HIGH);

  buttonA.attachClick(onClickA);
  buttonB.attachClick(onClickB);

  // start the GZLL stack
  RFduinoGZLL.begin(role);

  RFduino_ULPDelay(INFINITE);
}

void onClickA()
{
  if (RFduino_pinWoke(button_a)) {
    Serial.println("awoke from pin 5");
    RFduinoGZLL.sendToHost(0);
    Serial.println("sent 0");
  }
  RFduino_resetPinWake(button_a);
  RFduino_resetPinWake(button_b);
}
void onClickB()
{
  if (RFduino_pinWoke(button_b)) {
    Serial.println("awoke from pin 6");
    RFduinoGZLL.sendToHost(1);
    Serial.println("sent 1");
  }
  RFduino_resetPinWake(button_a);
  RFduino_resetPinWake(button_b);
}

void sendToHost(char player)
{
  RFduinoGZLL.sendToHost(player);
}

int prevA = 0;
int prevB = 0;
int currentA = 0;
int currentB = 0;

void loop()
{
  buttonA.tick();
  buttonB.tick();

  currentA = buttonA.getState();
  currentB = buttonB.getState();

  Serial.println("prevA: " + String(prevA));
  Serial.println("prevB: " + String(prevB));
  Serial.println("currentA: " + String(currentA));
  Serial.println("currentB: " + String(currentB));

  if (prevA >= 2 && currentA == 0 || prevB >= 2 && currentB == 0) {
    RFduino_ULPDelay(INFINITE);
  } else {
    delay(10);
  }
  prevA = currentA;
  prevB = currentB;
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{
}
