#include <RFduinoGZLL.h>
#include "OneButton.h"

device_t role = DEVICE0;

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
  Serial.begin(9600);
  Serial.println("waiting for connection...");
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
  sendToHost(0);
  resetAndSleep();
}

void onClickB()
{
  sendToHost(1);
  resetAndSleep();
}

void onDoubleClickA()
{
  sendToHost(2);
  resetAndSleep();
}

void onDoubleClickB()
{
  sendToHost(3);
  resetAndSleep();
}

void onLongPressA()
{
  sendToHost(4);
  resetAndSleep();
}

void onLongPressB()
{
  sendToHost(5);
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
  // Serial.println("sent " + String(command));
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
      // Hvis GZLL-stacken er paa, sov i 1 sek og sjekk s p nytt om stacken kan slaas av.
      if(gzllRunning) {
        RFduino_ULPDelay(1000);
      }
      else {
        RFduino_ULPDelay(INFINITE);
        shouldSleep = false;
      }
  }
  
  delay(10); // Kan ikke kalle tick for ofte... 
}

void RFduinoGZLL_onReceive(device_t device, int rssi, char *data, int len)
{
}
