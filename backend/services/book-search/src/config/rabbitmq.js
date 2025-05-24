const amqp = require("amqplib");
const redisClient = require("./redis");

let channel;

const connectWithRetry = async () => {
    const maxRetries = 5;
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            console.log("✅ Connected to RabbitMQ");
            return connection;
        } catch (err) {
            console.error(`❌ Failed to connect to RabbitMQ (attempt ${attempt + 1})`);
            await new Promise(res => setTimeout(res, 20000));
            attempt++;
        }
    }
    throw new Error("❌ Could not connect to RabbitMQ after multiple attempts");
};

const connectRabbitMQ = async () => {
    try {
        const connection = await connectWithRetry();
        channel = await connection.createChannel();
        await channel.assertQueue("book_events");

        console.log("📥 Connected to RabbitMQ (book-search)");
        
        channel.consume("book_events", (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                console.log("📩 Received:", content);

                const { type, data } = content;
                if (type === "book.updated" || type === "book.deleted") {
                    const cacheKey = `search:${data.title?.toLowerCase() || ""}:${data.author?.toLowerCase() || ""}`;
                    redisClient.del(cacheKey);
                    console.log("🗑️ Cache invalidated:", cacheKey);
                }

                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("❌ RabbitMQ connection failed:", error.message);
    }
};

module.exports = connectRabbitMQ;
