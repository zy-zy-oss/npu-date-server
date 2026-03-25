const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET || 'npu-date-secret-key-2024'

/**
 * 验证 JWT token
 */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({
      code: 401,
      message: '未提供 token'
    })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      code: 401,
      message: 'Token 无效或已过期'
    })
  }
}

/**
 * 生成 JWT token
 */
const generateToken = (userId, email) => {
  return jwt.sign(
    { userId, email },
    SECRET_KEY,
    { expiresIn: '7d' }
  )
}

module.exports = {
  authMiddleware,
  generateToken
}
