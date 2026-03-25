const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../db/database')
const { generateToken, authMiddleware } = require('../middleware/auth')
const { sendVerificationCode } = require('../services/emailService')

/**
 * 生成随机验证码
 */
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * POST /api/auth/send-code
 * 发送邮箱验证码
 */
router.post('/send-code', async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      code: 400,
      message: '邮箱不能为空'
    })
  }

  // 检查邮箱是否已注册
  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        message: '数据库错误',
        error: err.message
      })
    }

    if (row) {
      return res.status(400).json({
        code: 400,
        message: '邮箱已被注册'
      })
    }

    // 生成验证码
    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ') // 10分钟后过期，格式: YYYY-MM-DD HH:MM:SS

    // 删除该邮箱的旧验证码
    db.run('DELETE FROM email_verifications WHERE email = ?', [email], (err) => {
      if (err) {
        console.error('删除旧验证码失败:', err.message)
      }

      // 保存验证码到数据库
      db.run(
        'INSERT INTO email_verifications (email, code, expires_at) VALUES (?, ?, ?)',
        [email, code, expiresAt],
        async (err) => {
          if (err) {
            console.error('保存验证码失败:', err.message)
            return res.status(500).json({
              code: 500,
              message: '保存验证码失败',
              error: err.message
            })
          }

          console.log('验证码已保存:', { email, code, expiresAt })

          try {
            // 发送邮件
            const sent = await sendVerificationCode(email, code)
            
            res.json({
              code: 200,
              message: sent ? '验证码已发送到邮箱' : '验证码已生成（邮件发送可能失败，开发环境用 123456）',
              data: {
                devCode: process.env.NODE_ENV === 'development' ? code : undefined
              }
            })
          } catch (error) {
            console.error('发送邮件失败:', error.message)
            res.status(500).json({
              code: 500,
              message: '发送失败',
              error: error.message
            })
          }
        }
      )
    })
  })
})

/**
 * POST /api/auth/verify-code
 * 验证邮箱验证码
 */
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body

  if (!email || !code) {
    return res.status(400).json({
      code: 400,
      message: '邮箱和验证码不能为空'
    })
  }

  db.get(
    'SELECT * FROM email_verifications WHERE email = ? AND code = ? AND expires_at > datetime("now")',
    [email, code],
    (err, row) => {
      if (err) {
        console.error('验证码查询错误:', err.message)
        return res.status(500).json({
          code: 500,
          message: '数据库错误',
          error: err.message
        })
      }

      console.log('验证码验证查询结果:', { email, code, row: row ? { id: row.id, expires_at: row.expires_at } : null })

      if (!row) {
        // 额外查询所有该邮箱的验证码
        db.all('SELECT * FROM email_verifications WHERE email = ?', [email], (err2, rows) => {
          if (err2) {
            console.error('额外查询错误:', err2.message)
          } else {
            console.log('该邮箱的所有验证码:', rows.map(r => ({ code: r.code, expires_at: r.expires_at, verified: r.verified })))
          }
        })
        return res.status(400).json({
          code: 400,
          message: '验证码无效或已过期'
        })
      }

      // 标记为已验证
      db.run(
        'UPDATE email_verifications SET verified = 1 WHERE id = ?',
        [row.id],
        (err) => {
          if (err) {
            return res.status(500).json({
              code: 500,
              message: '验证失败'
            })
          }

          res.json({
            code: 200,
            message: '验证成功',
            data: {
              email: email,
              verified: true
            }
          })
        }
      )
    }
  )
})

/**
 * POST /api/auth/register
 * 注册新用户
 */
router.post('/register', (req, res) => {
  const { email, password, name, school } = req.body

  if (!email || !password || !name) {
    return res.status(400).json({
      code: 400,
      message: '邮箱、密码和名字不能为空'
    })
  }

  // 检查邮箱是否已验证
  db.get(
    'SELECT * FROM email_verifications WHERE email = ? AND verified = 1',
    [email],
    (err, verifiedRow) => {
      if (err || !verifiedRow) {
        return res.status(400).json({
          code: 400,
          message: '邮箱未验证或验证已过期'
        })
      }

      // 加密密码
      const hashedPassword = bcrypt.hashSync(password, 10)

      // 创建用户
      db.run(
        'INSERT INTO users (email, password, name, school) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, name, school || ''],
        function(err) {
          if (err) {
            return res.status(500).json({
              code: 500,
              message: '注册失败',
              error: err.message
            })
          }

          const token = generateToken(this.lastID, email)

          res.json({
            code: 200,
            message: '注册成功',
            data: {
              token,
              userInfo: {
                id: this.lastID,
                email,
                name,
                school
              }
            }
          })
        }
      )
    }
  )
})

/**
 * POST /api/auth/login
 * 用户登录
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      code: 400,
      message: '邮箱和密码不能为空'
    })
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          message: '登录失败',
          error: err.message
        })
      }

      if (!user) {
        return res.status(400).json({
          code: 400,
          message: '邮箱或密码错误'
        })
      }

      // 验证密码
      const isValidPassword = bcrypt.compareSync(password, user.password)
      
      if (!isValidPassword) {
        return res.status(400).json({
          code: 400,
          message: '邮箱或密码错误'
        })
      }

      const token = generateToken(user.id, user.email)

      res.json({
        code: 200,
        message: '登录成功',
        data: {
          token,
          userInfo: {
            id: user.id,
            email: user.email,
            name: user.name,
            school: user.school
          }
        }
      })
    }
  )
})

/**
 * GET /api/auth/profile
 * 获取用户信息
 */
router.get('/profile', authMiddleware, (req, res) => {
  db.get(
    'SELECT id, email, name, school, created_at FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          message: '查询失败'
        })
      }

      if (!user) {
        return res.status(404).json({
          code: 404,
          message: '用户不存在'
        })
      }

      res.json({
        code: 200,
        message: '获取成功',
        data: user
      })
    }
  )
})

module.exports = router
