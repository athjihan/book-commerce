const amqp = require("amqplib");
const cache = require("../config/cache");

const connectWithRetry = async () => {
    const maxRetries = 5;
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            console.log("✅ Connected to RabbitMQ");
            return connection;
        } catch (err) {
            attempt++;
            console.error(`❌ Failed to connect to RabbitMQ (attempt ${attempt})`);
            if (attempt >= maxRetries) break;
            await new Promise(res => setTimeout(res, 20000));
        }
    }
    throw new Error("❌ Could not connect to RabbitMQ after multiple attempts");
};

const consumeEvent = async () => {
    try {
        const connection = await connectWithRetry();
        const channel = await connection.createChannel();
        const queue = "book.events";

        await channel.assertQueue(queue, { durable: false });
        console.log("📡 [book-detail] Waiting for messages...");

        channel.consume(queue, async (msg) => {
            const event = JSON.parse(msg.content.toString());
            const { type, data } = event;

            console.log(`📨 Received event: ${type}`);

            if (type === "book.updated" || type === "book.deleted") {
                const cacheKey = `book-detail:${data.serial_number}:${data.book_type}`;
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
