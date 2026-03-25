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
    // 用户表
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        school TEXT,
        gender TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 邮箱验证表
    db.run(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        verified INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 问卷答案表
    db.run(`
      CREATE TABLE IF NOT EXISTS questionnaires (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL,
        answers TEXT NOT NULL,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `)

    // 匹配结果表
    db.run(`
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id_1 INTEGER NOT NULL,
        user_id_2 INTEGER NOT NULL,
        match_score REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id_1) REFERENCES users(id),
        FOREIGN KEY (user_id_2) REFERENCES users(id)
      )
    `)

    console.log('✓ 数据库表已初始化')
  })
}

module.exports = db
