var validators = require('./validators');
var logic = require('./logic');

module.exports = function(kafkaStream) {
  kafkaStream.on('data', receivedMessage);
};

function receivedMessage(rawMessage) {
  var message;

  try {
    message = JSON.parse(rawMessage.value);
  } catch (e) {
    console.error('Invalid JSON received');
    return;
  }

  console.log('Recieved message: ', message);

  if (!validators.isValidMessage(message)) {
    return;
  }

  logic.processMessage(message);
}
