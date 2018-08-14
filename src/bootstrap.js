var setupMongo = require('./setup/mongo');
var setupKafka = require('./setup/kafka');
var listener = require('./listener');

module.exports = function() {
  var kafkaStream = setupKafka.createConsumerStream('localhost:9092', ['messages']);
  setupMongo.connect();
  listener(kafkaStream);
};
