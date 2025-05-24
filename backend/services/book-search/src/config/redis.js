const redis = require("redis");

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect().then(() => console.log("🔌 Redis connected")).catch(console.error);

module.exports = redisClient;
