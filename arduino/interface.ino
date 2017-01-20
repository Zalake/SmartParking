#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
SoftwareSerial sw(13,15);

const char* ssid     = "<SSID>";
const char* password = "<Password>";
int pid=<parking lot number>;
const char* host = "<host-ip>";
const int sleepTimeS = 1*10; // Set sleep time in seconds for the deep sleep cycle
void POST(String data)
{
  delay(300);
  Serial.print("connecting to ");
  Serial.println(host);

  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 3001;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }
  
  String X="GET /api?pid="+String(pid)+"&name="+String(data)+" HTTP/1.1";
  // We now create a URI for the request
  Serial.print("Requesting POST: ");
  // Send request to the server:
  client.println(X);
  client.println("Content-Type: application/json");
  client.println("Connection: close");
  client.println();
  
  
  // Read all the lines of the reply from server and print them to Serial
  while (client.available()) {
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  Serial.println();
  Serial.println("closing connection");
}

void setup() {
  sw.begin(9600);
  Serial.begin(9600);
  delay(100);

  // We start by connecting to a WiFi network
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP()); // This is your NodeMCU IP address. Could be handy for other projects

}

void loop()
{
    String data="";
    while (sw.available() > 0) {
      data=data+(char)sw.read();
  }
  POST(data);
}


