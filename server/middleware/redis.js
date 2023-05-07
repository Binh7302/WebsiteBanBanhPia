const redis = require('ioredis');
require('dotenv').config();
let clientRedis;

(async () => {
    clientRedis = redis.createClient({
        host: process.env.REDIS_HOSTNAME,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    });

    clientRedis.on('connect', () => {
        console.log('Connected success to Redis');
    });

    clientRedis.on('error', (err) => {
        console.log('err: ' + err.message);
    });

    clientRedis.on('ready', () => {
        console.log('Redis is ready');
    });

    clientRedis.on('end', () => {
        console.log('Redis connection ended');
    });

    process.on('SIGINT', () => {
        clientRedis.quit();
    });

    await clientRedis.connect().then(() => {
        console.log('Connected to Redis');
    }).catch((err) => {
        console.log(err.message);
    });
})();

module.exports = clientRedis;