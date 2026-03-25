const Redis = require('ioredis')

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy(times) {
    if (times > 3) {
      console.error('✗ Redis 连接失败，停止重试')
      return null
    }
    return Math.min(times * 200, 2000)
  }
})

redis.on('connect', () => {
  console.log('✓ Redis 已连接')
})

redis.on('error', (err) => {
  console.error('✗ Redis 错误:', err.message)
})

module.exports = redis
