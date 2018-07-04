const Redis = require('ioredis');

// Create Redis Client
const client = new Redis();

const redisGet = async (key) => {
    return await client.get(key);
};

const redisIncrby = async (key, count) => {
    const parsedCount = parseInt(count);
    if (!isNaN(parsedCount)) await client.incrby(key, parsedCount);
};

module.exports = {
    redisGet,
    redisIncrby
}