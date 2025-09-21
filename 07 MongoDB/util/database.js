const monogodb = require("mongodb"); // official mongodb driver for node.js
const MongoClient = monogodb.MongoClient; // used to connect to the database

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://sherif:sherif@cluster0.dvjzu7d.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      console.log("Connected to MongoDB!");
      _db = client.db(); // we get the database object
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

module.exports = {
  mongoConnect,
  getDb,
};
