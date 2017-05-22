
const MongoClient = require('mongodb').MongoClient;

class dbManager {

    setup(){
        let that = this;

        MongoClient.connect('mongodb://localhost:27017/tcsdb', (err, database) => {
            if (err) {
                console.log('=> Debug => Database connection error');
                return console.log(err);
            }
            that.db = database;
        });
    }

    getAllTrafficRecords() {
        let collection = this.db.collection('trafficRecords');
        // collection.find().forEach(function(record){ 
        //     console.log(record._id);
        // });

        collection.find().toArray(function(err, results) {
            console.log(results);
            // send HTML file populated with quotes here
        })
    }

    getTrafficRecordsCount() {
        let collection = this.db.collection('trafficRecords');
        return collection.count();
    }

    findAllCollectionRecords(collection) {
        return this.db.collection(collection).find().toArray();
    }

    constructor() {
        console.log('Starting Database Manager');
        this.setup(); 
    }
}

module.exports = dbManager;