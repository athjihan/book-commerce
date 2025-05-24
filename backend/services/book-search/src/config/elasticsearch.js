const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || "http://localhost:9200",
});

module.exports = esClient;
