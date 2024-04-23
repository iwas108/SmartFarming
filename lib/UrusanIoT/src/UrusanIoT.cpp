#include "UrusanIoT.h"

UrusanIoT::UrusanIoT(const char* broker, const int port, const char* clientId, 
    const char* brokerUsername, const char* brokerPassword) : _broker(broker),
     _port(port), _clientId(clientId), _brokerUsername(brokerUsername), _brokerPassword(brokerPassword) {
    
}

void UrusanIoT::konek(){
    if(WiFi.status() != WL_CONNECTED){
      Serial.printf("UrusanIoT: Tidak ada koneksi!\n");
      delay(1000);
      return;
    }
    Serial.printf("UrusanIoT: Mencoba untuk konek ke %s:%d\n", _broker, _port);
    client.begin(_broker, _port, net);
    bool status = client.connect(_clientId, _brokerUsername, _brokerPassword);

    unsigned long timer = millis();
    while(!status){
      delay(100);
      if(millis() - timer > 10000){break;}
    }

    if(status){
        Serial.printf("UrusanIoT: Berhasil terhubung ke %s:%d\n", _broker, _port);
    }else{
        Serial.printf("UrusanIoT: Gagal terhubung ke %s:%d!\n", _broker, _port);
    }
}

/// @brief Cek apakah IoTnya konek.
/// @return 1 jika konek, 0 jika putus
bool UrusanIoT::apakahKonek() {
  if (client.connected()){
    return 1;
  }
  else {
    return 0;
  }
}

void UrusanIoT::proses(){
  client.loop();
  delay(10);
}