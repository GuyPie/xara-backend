# Companies DB

To run you need to have mongodb and kafka running, you can do so by following these guides:

- https://kafka.apache.org/quickstart
- https://docs.mongodb.com/manual/installation/

Automated test are run with `npm test`. The service can be manually tested by running it with `npm start` and sending JSON messages to the 'messages' topic - `bin/kafka-console-producer.sh --broker-list localhost:9092 --topic messages`.
