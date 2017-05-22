
const   SerialPort = require('serialport'),
        MongoClient = require('mongodb').MongoClient,
        Distance = 0.15;

class SerialManager {

    setup() {
        let that = this;
        that.recordStack = [];

        MongoClient.connect('mongodb://localhost:27017/tcsdb', (err, database) => {
            if (err) {
                console.log('=>Debug: Database connection error');
                return console.log(err);
            }
            that.db = database;
            
            that.port = new SerialPort('/dev/ttyACM0',{ baudrate: 9600, parser: SerialPort.parsers.readline('\n') }, (err) => {
                if (err) {
                    console.log('=>Debug: Serial port connection error');
                    return console.log('Error: ', err.message);
                }   
                this.initListeners();
            });
        });
    }

    dataHandler(sensor, state) {
        let that = this,
            currentTime = new Date();

        switch(sensor) {
            case '1':
                if (state === 'active') {
                    if (that.recordStack.length > 0) {
                        let obj = that.generateTimeObj(currentTime);
                        that.recordStack[0].sensor1.active = obj;
                    } else {
                        that.generateRecordObj(currentTime, 1);
                    }
                }else {
                    let obj = that.generateTimeObj(currentTime);
                    that.recordStack[0].sensor1.inactive = obj;
                    that.dataSender();
                }
            break;
            case '2':
                if (state === 'active') {
                    if (that.recordStack.length > 0) {
                        let obj = that.generateTimeObj(currentTime);
                        that.recordStack[0].sensor2.active = obj;    
                    } else {
                        that.generateRecordObj(currentTime, 2);
                    }
                }else {
                    let obj = that.generateTimeObj(currentTime);
                    that.recordStack[0].sensor2.inactive = obj;
                    that.dataSender();
                }
            break;
            default:
                console.log('=>Debug: Unhandled sensor');
            break;
        }
    }

    dataSender(){
        let that = this,
            obj = ( this.recordStack.length > 0 ) ? this.recordStack[0] : null;

        if (obj && obj.sensor1.active.fulldate && obj.sensor1.inactive.fulldate 
            && obj.sensor2.active.fulldate && obj.sensor2.inactive.fulldate) {
            console.log('=>Debug: Ready to send to DB');

            let date1 = new Date(obj.sensor1.active.fulldate),
                date2 = new Date(obj.sensor2.active.fulldate),
                timeDiff = Math.abs(date1.getTime() - date2.getTime()) / 1000,
                averageSpeed =  Distance / timeDiff;


            obj.time = timeDiff;
            obj.averageSpeed = averageSpeed;

            //Debug Block
            console.log('=>Debug: Results:');
            console.log('Time: '+timeDiff);
            console.log('Distance: '+Distance);
            console.log('Average Speed: '+averageSpeed+'m/s');
            // console.log('===================');
            // console.log('=>Debug: Object:');
            // console.log(obj);
            // console.log('=>Debug: ./Object:');

            this.saveToDB(obj);

            this.recordStack.pop();
        }
    }

    generateTimeObj(cTime){
        let obj = {
            fulldate: cTime,
            hour: cTime.getHours(),
            minute: cTime.getMinutes(),
            seconds: cTime.getSeconds()
        };
        return obj;
    }

    generateRecordObj(cTime, sensor) {
        let obj = this.generateTimeObj(cTime),
            dbRecord = {
                year: cTime.getFullYear(),
                month: cTime.getMonth()+1,
                day: cTime.getDate(),
                time: '',
                averageSpeed: '',
                sensor1: {
                    active: {},
                    inactive: {}
                },
                sensor2: {
                    active: {},
                    inactive: {}
                }
            };
        if (sensor === 1) {
            dbRecord.sensor1.active = obj;
        } else {
            dbRecord.sensor2.active = obj;
        }
        this.recordStack.push(dbRecord);
    }

    initListeners(){
        let that = this;
        console.log('=>Debug: Attaching listeners');

        that.port.on('data', function(data){
            let patt = new RegExp('=>Debug:'),
                debug = patt.test(data);

            if (!debug) {
                let obj = JSON.parse(data);
                console.log(obj);
                that.dataHandler(obj.sensor, obj.state);
            }else{
                console.log(data);
            }
        });
        console.log('=>Debug: Done');
    }

    saveToDB(object){
        console.log('=>Debug: Saving record to the database');
        let that = this,
            collection = that.db.collection('trafficRecords');

        collection.insertOne(object,function(err, r) {
            if (err === null) {
                console.log('=>Debug: Record saved');
            }else{
                console.log('=>Debug: Error while trying to save record to Database');
                console.log('=>Debug: Error:' + err);
            }
        });
    }

    constructor() {
        console.log('=>Debug: Serial Manager started');
        this.setup();
    }
}

module.exports = SerialManager;
