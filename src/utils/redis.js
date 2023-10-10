import redis from 'redis'; // 引入 redis

// 创建客户端
const redisClient = redis.createClient()

// 监听错误信息
redisClient.on('error', (error) => {
  console.log('Redis Client Error', error)
});

redisClient.on('connect', () => {
  console.log('Redis连接成功');
})

redisClient.connect(6379, '127.0.0.1')

export default redisClient

