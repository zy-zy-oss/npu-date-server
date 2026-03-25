const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const fs = require('fs')

const DB_PATH = path.join(__dirname, '../../data/npu-date.db')

// 确保数据目录存在
const dataDir = path.join(__dirname, '../../data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('数据库连接错误:', err.message)
  } else {
    console.log('✓ 数据库已连接')
    initTables()
  }
})

// 初始化表结构
const initTables = () => {
  db.serialize(() => {
    // 问卷答案表：同一邮箱 + 同一类型只保留一份（覆盖旧的）
    db.run(`
      CREATE TABLE IF NOT EXISTS questionnaires (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'base',
        answers TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(email, type)
      )
    `)

    // 匹配结果表
    db.run(`
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_a_email TEXT NOT NULL,
        user_b_email TEXT NOT NULL,
        type TEXT NOT NULL,
        score REAL,
        status TEXT NOT NULL DEFAULT 'pending',
        matched_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✓ 数据库表已初始化')
  })
}

module.exports = db
