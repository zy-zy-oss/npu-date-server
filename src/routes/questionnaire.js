const express = require('express')
const router = express.Router()
const db = require('../db/database')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { baseQuestionnaire, dateQuestionnaire, buddyQuestionnaire, mbtiQuestionnaire } = require('../data/questionnaires')
const { sendMatchResult } = require('../services/emailService')

/**
 * GET /api/questionnaire
 * 获取问卷配置（基础问卷）
 */
router.get('/', (req, res) => {
  const questionnaireData = {
    code: 200,
    message: '获取成功',
    data: baseQuestionnaire
  }
  res.json(questionnaireData)
})

/**
 * POST /api/questionnaire/submit
 * 提交问卷答案（极简版：每个邮箱对应一个问卷）
 */
router.post('/submit', (req, res) => {
  const { answers, email, type = 'base' } = req.body

  if (!answers) {
    return res.status(400).json({
      code: 400,
      message: '问卷答案不能为空'
    })
  }

  // 验证邮箱格式
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      code: 400,
      message: '邮箱不能为空且必须包含@符号'
    })
  }

  const emailNormalized = email.trim().toLowerCase()

  // 检查邮箱是否已存在
  db.get('SELECT id FROM questionnaires WHERE email = ?', [emailNormalized], (err, existingRow) => {
    if (err) {
      return res.status(500).json({
        code: 500,
        message: '检查问卷记录失败',
        error: err.message
      })
    }

    if (existingRow) {
      // 更新现有问卷
      db.run(
        'UPDATE questionnaires SET answers = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
        [JSON.stringify(answers), emailNormalized],
        function(updateErr) {
          if (updateErr) {
            return res.status(500).json({
              code: 500,
              message: '问卷更新失败',
              error: updateErr.message
            })
          }

          res.json({
            code: 200,
            message: '问卷已更新',
            data: {
              id: existingRow.id
            }
          })
        }
      )
    } else {
      // 插入新问卷
      db.run(
        'INSERT INTO questionnaires (email, answers) VALUES (?, ?)',
        [emailNormalized, JSON.stringify(answers)],
        function(insertErr) {
          if (insertErr) {
            return res.status(500).json({
              code: 500,
              message: '问卷提交失败',
              error: insertErr.message
            })
          }

          res.json({
            code: 200,
            message: '问卷提交成功',
            data: {
              id: this.lastID
            }
          })
        }
      )
    }
  })
})



/**
 * GET /api/questionnaire/type/date
 * 获取约会问卷配置
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
 * 获取搭子问卷配置
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
 * 获取MBTI问卷配置
 */
router.get('/type/mbti', (req, res) => {
  res.json({
    code: 200,
    message: '获取成功',
    data: mbtiQuestionnaire
  })
})

module.exports = router
