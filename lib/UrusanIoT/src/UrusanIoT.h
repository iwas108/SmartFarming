#ifndef UrusanIoT_h
#define UrusanIoT_h

#include <WiFi.h>
#include <MQTT.h>

class UrusanIoT {
    public:
        UrusanIoT(const char* _broker, int _port, const char* _clientId, 
            const char* brokerUsername, const char* brokerPassword);
        void konek();
        bool apakahKonek();
        void proses();

    private:
        const char* _broker;
        const int _port;
        const char* _clientId;
        const char* _brokerUsername;
        const char* _brokerPassword;
        WiFiClient net;
        MQTTClient client;
};

#endif