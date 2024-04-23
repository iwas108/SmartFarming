#include <Arduino.h>
#include <UrusanWiFi.h>
#include <UrusanIoT.h>
#include "secret.h"

UrusanWiFi urusanWiFi(ssid, pass);
UrusanIoT urusanIoT(broker, port, id, brokerUsername, brokerPassword);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);

  urusanWiFi.konek();
  urusanIoT.konek();
}

void loop() {
  // put your main code here, to run repeatedly:
  urusanIoT.proses();

  if(urusanWiFi.apakahKonek() == 0){
    urusanWiFi.konek();
  }

  if(urusanWiFi.apakahKonek() == 1 && urusanIoT.apakahKonek() == 0){
    urusanIoT.konek();
  }
}