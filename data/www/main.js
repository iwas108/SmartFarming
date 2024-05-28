document.addEventListener('DOMContentLoaded', function() {
    function generateRandomString(length) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    // Buat instan client: alamat Broker, Port, Websocket Path, Client ID
    var klienIdUnik = "gantinamaperusahaan.tld-gantinamadivisi-browser" + generateRandomString(5);
    client = new Paho.MQTT.Client("broker.hivemq.com", Number(8000), "/mqtt", klienIdUnik);

    // setel penangkap panggilan balik
    client.onConnectionLost = function (responseObject) {
        statusKoneksi.innerHTML = "Terputus!";
        statusKoneksi.classList.add("red");
        statusKoneksi.classList.remove("green");
        console.log("Koneksi Putus: "+responseObject.errorMessage);
    }

    client.onMessageArrived = function (message) {
        console.log("Pesan Tiba: "+message.payloadString);

        // Seluruh logika data masuk dan pembaruan antarmuka ada di sini
        // Penangan pesan MCA        
        if(message.destinationName == "namaperusahaan.tld/namadivisi1"){
            var data = JSON.parse(message.payloadString);

            var suhu = parseFloat(data.suhu).toFixed(2);
            var kelembapan = parseFloat(data.kelembapan).toFixed(2);

            divSuhu = document.getElementById("suhu");
            divSuhu.innerHTML = suhu;

            divKelembapan = document.getElementById("kelembapan");
            divKelembapan.innerHTML = kelembapan;
        }  

        //Penangan Pesan MAA
        if(message.destinationName == "namaperusahaan.tld/namadivisi2"){
            var data = JSON.parse(message.payloadString);
            
            var arah = parseInt(data.arah);
            var kekuatan = parseInt(data.kekuatan);
            var status = data.status;

            divStatusBlower = document.getElementById("statusBlower");
            divArahBlower = document.getElementById("arahBlower");
            divSliderKekuatanBlower = document.getElementById("sliderKekuatanBlower");

            divStatusBlower.innerHTML = status ? "Blower ON" : "Blower OFF";

            if(status){
                divStatusBlower.classList.add("green");
                divStatusBlower.classList.remove("red");
            }else{
                divStatusBlower.classList.add("red");
                divStatusBlower.classList.remove("green");
            }

            divArahBlower.value = String(arah);
            divSliderKekuatanBlower.value = kekuatan;

        }

        //Penangan Pesan FRA
        if(message.destinationName == "namaperusahaan.tld/namadivisi3"){
            var data = JSON.parse(message.payloadString);
            var level = parseFloat(data.level).toFixed(2);

            setWaterLevel(level);
        }
        
        //Penangan Pesan FPA
        if(message.destinationName == "namaperusahaan.tld/namadivisi4"){
            var data = JSON.parse(message.payloadString);

            var status = data.status;
            console.log(status);

            divStatusPompaFertigasi = document.getElementById("statusPompaFertigasi");
            divStatusPompaFertigasi.innerHTML = status ? "Pompa ON" : "Pompa OFF";

            if(status){
                divStatusPompaFertigasi.classList.add("green");
                divStatusPompaFertigasi.classList.remove("red");
            }else{
                divStatusPompaFertigasi.classList.add("red");
                divStatusPompaFertigasi.classList.remove("green");
            }

            divKelembapan = document.getElementById("kelembapan");
            divKelembapan.innerHTML = kelembapan;
        }  
        
        
    }

    // Dipanggil saat koneksi berhasil
    function onConnect(){
        statusKoneksi = document.getElementById("statusKoneksi");
        statusKoneksi.innerHTML = "Terhubung!";
        statusKoneksi.classList.add("green");
        statusKoneksi.classList.remove("red");
        //Subscribe semua topic baris demi baris yang ingin didengarkan di sini.
        client.subscribe("namaperusahaan.tld/namadivisi1"); // Ini MCA
        client.subscribe("namaperusahaan.tld/namadivisi1/setelan"); // Ini setelan MCA
        client.subscribe("namaperusahaan.tld/namadivisi2"); // Ini MAA
        client.subscribe("namaperusahaan.tld/namadivisi2/setelan"); // Ini setelan MAA
        client.subscribe("namaperusahaan.tld/namadivisi3"); // Ini FRA
        client.subscribe("namaperusahaan.tld/namadivisi3/setelan"); // Ini setelan FRA
        client.subscribe("namaperusahaan.tld/namadivisi4"); // Ini FPA
        client.subscribe("namaperusahaan.tld/namadivisi4/setelan"); // Ini setelan FPA
        console.log("Tersambung!");
    }

    // Fungsi untuk mengirim pesan ke broker
    function kirimPesan(pesan, topik){
        var pesanText = JSON.stringify(pesan);
        
        message = new Paho.MQTT.Message(pesanText);
        message.destinationName = topik;

        client.send(message);
    }

    // Hubungkan client, berikan penangkap panggilan balik saat sukses ke onConnect
    client.connect({
        onSuccess: onConnect
    });

    document.getElementById("sliderKekuatanBlower").addEventListener("change", function() {
        // Code to handle the change event for Slider 1
        console.log("Kekuatan blower diset ke: " + this.value);
    });

    function setWaterLevel(level) {
        waterElement = document.getElementById("water");
        waterElement.style.height = level + '%';
    }

    document.getElementById("switchPompaFertigasiOn").addEventListener("click", function() {
        var perintah = {
            "perintah": "nyalakan"
        };

        kirimPesan(perintah, "namaperusahaan.tld/namadivisi4/setelan");
    });

    document.getElementById("switchPompaFertigasiOff").addEventListener("click", function() {
        var perintah = {
            "perintah": "padamkan"
        };

        kirimPesan(perintah, "namaperusahaan.tld/namadivisi4/setelan");
    });

    document.getElementById("switchBlowerOn").addEventListener("click", function() {
        divArahBlower = document.getElementById("arahBlower");
        divSliderKekuatanBlower = document.getElementById("sliderKekuatanBlower");

        var perintah = {
            "perintah": "nyalakan",
            "arah": divArahBlower.value,
            "kekuatan": divSliderKekuatanBlower.value
        };

        kirimPesan(perintah, "namaperusahaan.tld/namadivisi2/setelan");
    });

    document.getElementById("switchBlowerOff").addEventListener("click", function() {
        var perintah = {
            "perintah": "padamkan"
        };

        kirimPesan(perintah, "namaperusahaan.tld/namadivisi2/setelan");
    });

    document.getElementById("switchBlowerAnginTopan").addEventListener("click", function() {
        divArahBlower = document.getElementById("arahBlower");

        var perintah = {
            "perintah": "nyalakan",
            "arah": divArahBlower.value
        };

        kirimPesan(perintah, "namaperusahaan.tld/namadivisi2/setelan");
    });

    

 });