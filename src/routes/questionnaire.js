const express = require('express')
const router = express.Router()
const db = require('../db/database')
const { baseQuestionnaire, dateQuestionnaire, buddyQuestionnaire, mbtiQuestionnaire } = require('../data/questionnaires')

/**
 * GET /api/questionnaire
 * 获取问卷配置（基础问卷）
 */
router.get('/', (req, res) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: baseQuestionnaire
  })
})

/**
 * POST /api/questionnaire/submit
 * 提交问卷答案（同一邮箱 + 类型会覆盖旧记录）
 * 支持合并提交：基础问卷 + 搭子/恋爱问卷
 */
router.post('/submit', (req, res) => {
  const { answers, email, type = 'buddy' } = req.body

  if (!answers) {
    return res.status(400).json({
      code: 400,
      message: '问卷答案不能为空'
    })
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      code: 400,
      message: '邮箱不能为空且必须包含@符号'
    })
  }

  // 验证类型只能是 'buddy' 或 'date'
  if (type !== 'buddy' && type !== 'date') {
    return res.status(400).json({
      code: 400,
      message: '问卷类型只能是 buddy 或 date'
    })
  }

  const emailNormalized = email.trim().toLowerCase()

  // Upsert: insert or replace on (email, type) conflict
  db.run(
    `INSERT INTO questionnaires (email, type, answers, updated_at)
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(email, type) DO UPDATE SET
       answers = excluded.answers,
       updated_at = CURRENT_TIMESTAMP`,
    [emailNormalized, type, JSON.stringify(answers)],
    function (err) {
      if (err) {
        return res.status(500).json({
          code: 500,
          message: '问卷提交失败',
          error: err.message
        })
      }

      res.json({
        code: 200,
        message: '问卷提交成功',
        data: { id: this.lastID }
      })
    }
  )
})

/**
 * GET /api/questionnaire/type/date
 */
router.get('/type/date', (req, res) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: dateQuestionnaire
  })
})

/**
 * GET /api/questionnaire/type/buddy
 */
router.get('/type/buddy', (req, res) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: buddyQuestionnaire
  })
})

/**
 * GET /api/questionnaire/type/mbti
 */
router.get('/type/mbti', (req, res) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: mbtiQuestionnaire
  })
})

module.exports = router
