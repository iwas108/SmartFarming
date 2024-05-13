#ifndef UrusanAktuatorLingkungan_h
#define UrusanAktuatorLingkungan_h

#include <Wire.h>
#include <Adafruit_SHT31.h>

class UrusanAktuatorLingkungan {
    public:
        UrusanAktuatorLingkungan();
        bool mulai();
        float nyalakan(uint8_t kekuatan, bool arah);
        void padamkan();
    
    private:
        float _kekuatan;
        float _arah;
};

#endif