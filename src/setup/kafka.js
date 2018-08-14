var Kafka = require('node-rdkafka');

module.exports.createConsumerStream = function(host, topics) {
  var config = {
    'metadata.broker.list': host,
    'group.id': 'business',
    offset_commit_cb: function(err, topicPartition) {
      if (err) {
        console.log('Error in kafka commit', {
          error_message: err.stack,
          error_code: err.code,
          topic_partition: topicPartition
        });
        return;
      }

      console.log('Commit done', topicPartition);
    }
  };

  return new Kafka.createReadStream(config, {}, { topics: topics });
};
