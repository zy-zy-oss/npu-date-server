const express = require('express')
const router = express.Router()
const db = require('../db/database')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { authMiddleware } = require('../middleware/auth')
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
 * 提交问卷答案（支持未登录匿名提交，提供邮箱可关联账号）
 */
router.post('/submit', async (req, res) => {
  const { answers, email } = req.body
  let userId = req.user?.userId

  if (!answers) {
    return res.status(400).json({
      code: 400,
      message: '问卷答案不能为空'
    })
  }

  const ensureUserId = () => {
    return new Promise((resolve, reject) => {
      if (userId) {
        return resolve(userId)
      }

      const fallbackEmail = (email || 'anonymous@anonymous.npu-date').trim().toLowerCase()
      db.get('SELECT id FROM users WHERE email = ?', [fallbackEmail], (err, row) => {
        if (err) {
          return reject(err)
        }
        if (row) {
          return resolve(row.id)
        }

        const randomPassword = crypto.randomBytes(8).toString('hex')
        const hashedPassword = bcrypt.hashSync(randomPassword, 10)
        db.run(
          'INSERT INTO users (email, password, name, school) VALUES (?, ?, ?, ?)',
          [fallbackEmail, hashedPassword, '匿名用户', ''],
          function(insertErr) {
            if (insertErr) {
              return reject(insertErr)
            }
            if (this.lastID) {
              return resolve(this.lastID)
            }
            db.get('SELECT id FROM users WHERE email = ?', [fallbackEmail], (err2, row2) => {
              if (err2 || !row2) {
                return reject(err2 || new Error('无法获取用户ID'))
              }
              resolve(row2.id)
            })
          }
        )
      })
    })
  }

  try {
    userId = await ensureUserId()
  } catch (err) {
    console.error('获取用户ID失败:', err)
    return res.status(500).json({
      code: 500,
      message: '用户标识失败',
      error: err.message
    })
  }

  // 检查用户是否已提交过问卷
  db.get(
    'SELECT id FROM questionnaires WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1',
    [userId],
    (err, existingRow) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          message: '检查问卷记录失败',
          error: err.message
        })
      }

      if (existingRow) {
        db.run('DELETE FROM questionnaires WHERE id = ?', [existingRow.id], (delErr) => {
          if (delErr) {
            console.error('删除旧问卷失败:', delErr.message)
          }
        })
      }

      db.run(
        'INSERT INTO questionnaires (user_id, type, answers) VALUES (?, ?, ?)',
        [userId, 'base', JSON.stringify(answers)],
        function(insertErr) {
          if (insertErr) {
            return res.status(500).json({
              code: 500,
              message: '问卷提交失败',
              error: insertErr.message
            })
          }

          const sendEmail = async () => {
            return new Promise((resolve) => {
              db.get('SELECT email, name FROM users WHERE id = ?', [userId], async (err2, user) => {
                if (user && user.email) {
                  const matchInfo = {
                    matchName: user.name || '心动的朋友',
                    matchSchool: '西北工业大学',
                    matchGender: answers.gender === 'male' ? '男' : '女',
                    matchScore: 85
                  }
                  await sendMatchResult(user.email, matchInfo).catch(err3 => {
                    console.error('发送问卷完成邮件失败:', err3.message)
                  })
                }
                resolve()
              })
            })
          }

          sendEmail()

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
  )
})

/**
 * GET /api/questionnaire/my
 * 获取当前用户的问卷记录
 */
router.get('/my', authMiddleware, (req, res) => {
  const userId = req.user.userId

  db.get(
    'SELECT * FROM questionnaires WHERE user_id = ? ORDER BY submitted_at DESC LIMIT 1',
    [userId],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          message: '查询失败',
          error: err.message
        })
      }

      if (!row) {
        return res.status(404).json({
          code: 404,
          message: '未找到问卷记录'
        })
      }

      res.json({
        code: 200,
        message: '获取成功',
        data: {
          ...row,
          answers: JSON.parse(row.answers)
        }
      })
    }
  )
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
