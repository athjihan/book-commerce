const { Client } = require("@elastic/elasticsearch");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createElasticsearchClientWithRetry(nodeUrl, maxRetries = 5, retryInterval = 20000) {
  let client;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Mencoba menghubungkan ke Elasticsearch (percobaan ${attempt}/${maxRetries})...`);
      client = new Client({
        node: nodeUrl,
      });

      await client.ping();
      console.log("✅ Berhasil terhubung ke Elasticsearch!");
      return client;
    } catch (error) {
      lastError = error;
      console.warn(`❌ Gagal terhubung ke Elasticsearch (percobaan ${attempt}/${maxRetries}): ${error.message}`);

      if (attempt < maxRetries) {
        console.log(`Mencoba lagi dalam ${retryInterval / 1000} detik...`);
        await delay(retryInterval);
      }
    }
  }

  console.error(`🚫 Gagal terhubung ke Elasticsearch setelah ${maxRetries} percobaan.`);
  throw lastError;
}

const esClientPromise = createElasticsearchClientWithRetry(process.env.ELASTICSEARCH_NODE)
  .catch(error => {
    console.error("🔴 Inisialisasi Elasticsearch Client gagal secara permanen:", error.message);
    throw error;
  });

module.exports = esClientPromise;
