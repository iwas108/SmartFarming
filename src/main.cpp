#include <Arduino.h>
#include <UrusanWiFi.h>
#include "secret.h"

UrusanWiFi urusanWiFi(ssid, pass);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  urusanWiFi.konek();
}

void loop() {
  // put your main code here, to run repeatedly:
}