//the time we give the sensor to calibrate (10-60 secs according to the datasheet)
int calibrationTime = 60;       
 
//the time when the sensor outputs a low impulse
long unsigned int lowIn;        
 
//the amount of milliseconds the sensor has to be low
//before we assume all motion has stopped
long unsigned int pause = 5000; 
 
boolean lockLow = true;
boolean takeLowTime; 

int loopCounter = 1; 
int pir_one_Pin = 3; //the digital pin connected to the PIR sensor's output
int pir_two_Pin = 5;
int led_one_Pin = 11;
int led_two_Pin = 13;
bool led1State = false;
bool led2State = false;
 
 
/////////////////////////////
//SETUP
void setup(){
  Serial.begin(9600);
  pinMode(pir_one_Pin, INPUT);
  pinMode(pir_two_Pin, INPUT);
  pinMode(led_one_Pin, OUTPUT);
  pinMode(led_two_Pin, OUTPUT);
  digitalWrite(pir_one_Pin, HIGH);
  digitalWrite(pir_two_Pin, HIGH);
 
  //give the sensor some time to calibrate
  Serial.println("=>Debug: calibrating sensor");
    for(int i = 0; i < calibrationTime; i++){
      delay(1000);
      }
    Serial.println("=>Debug: done");
    Serial.println("=>Debug: Sensors Active");
    delay(50);
  }
 
////////////////////////////
//LOOP
void loop(){
    //Serial.println("Starting Loop: #" + loopCounter);
    
    int pir1Test = (digitalRead(pir_one_Pin) == HIGH) ? 1 : 0;
    int pir2Test = (digitalRead(pir_two_Pin) == HIGH) ? 1 : 0;
                                                                        //Activate led when sensor1 detects an object
    if(digitalRead(pir_one_Pin) == LOW && !led1State){
        Serial.println("{\"sensor\":\"1\",\"state\":\"active\"}");
        led1State = true;
        digitalWrite(led_one_Pin, HIGH);   //led1 turns on
        //delay(100);
    }else if(digitalRead(pir_one_Pin) == HIGH && led1State){
        Serial.println("{\"sensor\":\"1\",\"state\":\"inactive\"}");
        led1State = false;                
        digitalWrite(led_one_Pin, LOW); //led1 turns off
    }
                                                                        //Activate led when sensor2 detects an object
    if(digitalRead(pir_two_Pin) == LOW && !led2State){
        Serial.println("{\"sensor\":\"2\",\"state\":\"active\"}");
        led2State = true;
        digitalWrite(led_two_Pin, HIGH);   //led2 turns on
        //delay(100);
    }else if(digitalRead(pir_two_Pin) == HIGH && led2State){
        Serial.println("{\"sensor\":\"2\",\"state\":\"inactive\"}");
        led2State = false;          
        digitalWrite(led_two_Pin, LOW);   //led2 turns off
    }
    delay(50);
}
