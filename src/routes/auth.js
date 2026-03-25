const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const redis = require('../db/redis')
const { sendVerificationCode } = require('../services/emailService')

const CODE_TTL = 10 * 60       // 10 minutes
const RATE_LIMIT_TTL = 60       // 60 seconds

/**
 * POST /api/auth/send-code
 * Send a 6-digit verification code to the given email
 */
router.post('/send-code', async (req, res) => {
  const { email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      code: 400,
      message: '请输入有效的邮箱地址'
    })
  }

  const emailKey = `verify:${email}`
  const rateLimitKey = `rate:${email}`

  try {
    // Rate limit: prevent resending within 60 seconds
    const rateLimited = await redis.exists(rateLimitKey)
    if (rateLimited) {
      return res.status(429).json({
        code: 429,
        message: '验证码已发送，请60秒后再试'
      })
    }

    // Generate 6-digit code
    const code = crypto.randomInt(100000, 999999).toString()

    const sent = await sendVerificationCode(email, code)
    if (!sent) {
      return res.status(500).json({
        code: 500,
        message: '验证码发送失败，请稍后重试'
      })
    }

    // Store code in Redis with TTL
    await redis.set(emailKey, code, 'EX', CODE_TTL)
    await redis.set(rateLimitKey, '1', 'EX', RATE_LIMIT_TTL)

    res.json({
      code: 200,
      message: '验证码已发送'
    })
  } catch (error) {
    console.error('发送验证码失败:', error)
    res.status(500).json({
      code: 500,
      message: '验证码发送失败，请稍后重试'
    })
  }
})

/**
 * POST /api/auth/verify-code
 * Verify the code the user entered
 */
router.post('/verify-code', async (req, res) => {
  const { email, code } = req.body

  if (!email || !code) {
    return res.status(400).json({
      code: 400,
      message: '邮箱和验证码不能为空'
    })
  }

  const emailKey = `verify:${email}`

  try {
    const storedCode = await redis.get(emailKey)

    if (!storedCode) {
      return res.status(400).json({
        code: 400,
        message: '验证码不存在或已过期，请重新发送'
      })
    }

    if (storedCode !== code.toString()) {
      return res.status(400).json({
        code: 400,
        message: '验证码错误'
      })
    }

    // Verification successful — delete the used code
    await redis.del(emailKey)

    res.json({
      code: 200,
      message: '验证成功'
    })
  } catch (error) {
    console.error('验证失败:', error)
    res.status(500).json({
      code: 500,
      message: '验证失败，请稍后重试'
    })
  }
})

module.exports = router
