#include <RFduinoGZLL.h>
#include "OneButton.h"

device_t role = DEVICE0;

int button_a = 5;
int button_b = 6;

OneButton buttonA(button_a, false);
OneButton buttonB(button_b, false);

bool shouldSleep = false;

void setup()
{
  Serial.begin(9600);
  Serial.println("waiting for connection...");
  RFduino_pinWake(button_a, HIGH);
  RFduino_pinWake(button_b, HIGH);

  buttonA.attachClick(onClickA);
  buttonA.attachLongPressStop(onLongPressA);
  buttonB.attachClick(onClickB);
  buttonB.attachLongPressStop(onLongPressB);

  // start the GZLL stack
  RFduinoGZLL.begin(role);

  resetAndSleep();
}

void onClickA()
{
  sendToHost(0);
  resetAndSleep();
}
void onClickB()
{
  sendToHost(1);
  resetAndSleep();
}
void onLongPressA()
{
  sendToHost(2);
  resetAndSleep();
}
void onLongPressB()
{
  sendToHost(3);
  resetAndSleep();
}

void resetAndSleep()
{
  RFduino_resetPinWake(button_a);
  RFduino_resetPinWake(button_b);
  shouldSleep = true;
}

void sendToHost(int command)
{
  RFduinoGZLL.sendToHost(command);
  Serial.println("sent " + String(command));
}

void tick()
{
  buttonA.tick();
  buttonB.tick();
}

void loop()
{
  tick();
  if (shouldSleep) {
      delay(10);
      RFduino_ULPDelay(INFINITE);
      shouldSleep = false;
  }
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{
}
