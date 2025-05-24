const amqp = require("amqplib");
const cache = require("../config/cache");

const consumeEvent = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = "book.events";

    await channel.assertQueue(queue, { durable: false });
    console.log("📡 [book-detail] Waiting for messages...");

    channel.consume(queue, async (msg) => {
      const event = JSON.parse(msg.content.toString());
      const { type, data } = event;

      console.log(`📨 Received event: ${type}`);

      if (type === "book.updated" || type === "book.deleted") {
        const cacheKey = `book-detail:${data._id}`;
        await cache.del(cacheKey);
        console.log(`🧹 Cache cleared for key: ${cacheKey}`);
      }

      channel.ack(msg);
    });
  } catch (err) {
    console.error("❌ RabbitMQ error:", err.message);
  }
};

module.exports = consumeEvent;
