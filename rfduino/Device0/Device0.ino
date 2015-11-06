#include <RFduinoGZLL.h>
#include "OneButton.h"

device_t role = DEVICE0;

int BUTTON_A_SINGLE = 0;
int BUTTON_B_SINGLE = 1;
int BUTTON_A_DOUBLE = 2;
int BUTTON_B_DOUBLE = 3;
int BUTTON_A_LONG = 4;
int BUTTON_B_LONG = 5;

int gzllTimeout = 10000;

int button_a = 5;
int button_b = 6;

OneButton buttonA(button_a, false);
OneButton buttonB(button_b, false);

bool shouldSleep = false;

bool gzllRunning = false;
long gzllLastCommandTime = 0;

void setup()
{
  RFduino_pinWake(button_a, HIGH);
  RFduino_pinWake(button_b, HIGH);

  buttonA.attachClick(onClickA);
  buttonB.attachClick(onClickB);
  buttonA.attachDoubleClick(onDoubleClickA);
  buttonB.attachDoubleClick(onDoubleClickB);
  buttonA.attachLongPressStop(onLongPressA);
  buttonB.attachLongPressStop(onLongPressB);

  resetAndSleep();
}

void onClickA()
{
  sendToHost(BUTTON_A_SINGLE);
  resetAndSleep();
}

void onClickB()
{
  sendToHost(BUTTON_B_SINGLE);
  resetAndSleep();
}

void onDoubleClickA()
{
  sendToHost(BUTTON_A_DOUBLE);
  resetAndSleep();
}

void onDoubleClickB()
{
  sendToHost(BUTTON_B_DOUBLE);
  resetAndSleep();
}

void onLongPressA()
{
  sendToHost(BUTTON_A_LONG);
  resetAndSleep();
}

void onLongPressB()
{
  sendToHost(BUTTON_B_LONG);
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
  startGzll();
  RFduinoGZLL.sendToHost(command);
  gzllLastCommandTime = millis();
  delay(10);
}

void startGzll()
{
  if(!gzllRunning){
    gzllRunning = true;
    RFduinoGZLL.begin(role);
  }
}

void stopGzll()
{
  if(gzllRunning){
    RFduinoGZLL.end();
    gzllRunning = false;
  }
}

void tick()
{
  buttonA.tick();
  buttonB.tick();
}

void loop()
{
  // Hvis GZLL har kjrt lengre enn timeout, avslutt GZLL-stacken.
  if(gzllLastCommandTime != 0 && (millis() - gzllLastCommandTime) > gzllTimeout){
    stopGzll();
  }

  tick();

  if (shouldSleep) {
      // Hvis GZLL-stacken er paa, sov til timeout og sjekk s p nytt om stacken kan slaas av.
      if(gzllRunning) {
        RFduino_ULPDelay(gzllTimeout);
      }
      else {
        shouldSleep = false;
        RFduino_ULPDelay(INFINITE);
      }
  }

  delay(10); // Kan ikke kalle tick for ofte...
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{
}
