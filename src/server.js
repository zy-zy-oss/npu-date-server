const express = require('express')
const cors = require('cors')
require('dotenv').config()

// 导入路由
const authRoutes = require('./routes/auth')
const questionnaireRoutes = require('./routes/questionnaire')
const db = require('./db/database')

const app = express()
const PORT = process.env.PORT || 5001

// CORS 配置 - 更宽松的设置
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://127.0.0.1:3001']
    // 允许没有 origin 的请求（比如移动应用或 curl 请求）
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('CORS 不允许此源'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}

// 中间件
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '后端服务运行正常' })
})

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/questionnaire', questionnaireRoutes)

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    code: 500,
    message: '服务器错误',
    error: err.message
  })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在'
  })
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   NPU Date 后端服务已启动              ║
╚════════════════════════════════════════╝
  
  服务器地址: http://localhost:${PORT}
  健康检查: http://localhost:${PORT}/health
  
  可用接口:
  - POST   /api/auth/send-code          (发送验证码)
  - POST   /api/auth/verify-code        (验证验证码)
  - POST   /api/auth/register           (注册用户)
  - POST   /api/auth/login              (用户登录)
  - GET    /api/auth/profile            (获取用户信息)
  - GET    /api/questionnaire           (获取问卷)
  - POST   /api/questionnaire/submit    (提交问卷)
  - GET    /api/questionnaire/:userId   (获取用户问卷记录)
  `)
})

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\\n正在关闭服务器...')
  db.close((err) => {
    if (err) {
      console.error(err.message)
    }
    console.log('数据库已关闭')
    process.exit(0)
  })
})
