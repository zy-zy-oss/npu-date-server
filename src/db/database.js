const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const DB_PATH = path.join(__dirname, '../../data/npu-date.db')

// 确保数据目录存在
const fs = require('fs')
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
    // 问卷答案表（极简版：每个邮箱对应一个问卷）
    db.run(`
      CREATE TABLE IF NOT EXISTS questionnaires (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        answers TEXT NOT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✓ 数据库表已初始化')
  })
}

module.exports = db
