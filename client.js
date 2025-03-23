// const {Redis} = require('ioredis');

// const client = new Redis();

// // async function init(){
// //     console.log("in client ",await client.get("otp:user@gmail.com"));
// // }

// // init();
// //

// module.exports = client;



const { Redis } = require('ioredis');
const dotenv = require('dotenv')
dotenv.config();

console.log(process.env.REDIS_URL)

const client = new Redis(process.env.REDIS_URL, {
    tls: {}
});

client.on("error", (err) => console.error("Redis Connection Error:", err));

module.exports = client;
