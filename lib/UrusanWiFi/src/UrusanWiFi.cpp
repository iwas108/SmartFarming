#include "UrusanWiFi.h"

UrusanWiFi::UrusanWiFi(const char* ssid, const char* pass) : _ssid(ssid), _pass(pass) {}
UrusanWiFi::UrusanWiFi(const char* ssid) : _ssid(ssid) {}

void UrusanWiFi::konek() {
  Serial.printf("UrusanWiFi: Mencoba konek ke %s... \n", _ssid);
  
  if(_pass != nullptr){
    WiFi.begin(_ssid, _pass);
  }else
  {
    WiFi.begin(_ssid);
  }

  WiFi.onEvent([this](WiFiEvent_t event, WiFiEventInfo_t info){
    this->onWiFiEvent(event, info);
  });
}

/// @brief Cek apakah WiFinya konek.
/// @return "konek", "putus", "bermasalah"
String UrusanWiFi::apakahKonek() {
  if (WiFi.isConnected() == WL_CONNECTED){
    return "konek";
  }
  else if(WiFi.isConnected() == WL_DISCONNECTED){
    return "putus";
  }
  else {
    return "bermasalah";
  }

}

void UrusanWiFi::onWiFiEvent(WiFiEvent_t event, WiFiEventInfo_t info) {
  // Implement your event handling logic here
  // For example, you can print event details
  if(event == ARDUINO_EVENT_WIFI_STA_DISCONNECTED){
    Serial.printf("UrusanWiFi: Koneksi dengan %s terputus!\n", info.wifi_sta_connected.ssid);
  }
  else if(event == ARDUINO_EVENT_WIFI_STA_CONNECTED){
    Serial.printf("UrusanWiFi: Berhasil terhubung dengan %s.\n", info.wifi_sta_connected.ssid);
  }
  else if(event == ARDUINO_EVENT_WIFI_STA_GOT_IP){
    Serial.printf("UrusanWiFi: Alamat IP %s.\n", WiFi.localIP().toString().c_str());
  }
}