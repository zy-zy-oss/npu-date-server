const nodemailer = require('nodemailer')
require('dotenv').config()

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  // 163邮箱 SMTP 配置
  host: 'smtp.163.com',
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER || 'your-email@163.com',
    pass: process.env.EMAIL_PASSWORD || 'your-authorization-code'
  }
})

// 验证邮件配置
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠ 邮件配置有问题（开发环境可忽略）:', error.message)
  } else {
    console.log('✓ 邮件服务已就绪')
  }
})

/**
 * 发送邮箱验证码
 */
const sendVerificationCode = async (email, code) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'npu-date@example.com',
      to: email,
      subject: '西联计划 - 邮箱验证码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <div style="background: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">西联计划</h2>
            <p style="color: #666; font-size: 14px;">尊敬的用户，感谢您注册西联计划。</p>
            
            <div style="background: #f0f0f0; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #999; font-size: 12px;">您的验证码</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #000; letter-spacing: 4px;">${code}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">验证码有效期为 10 分钟，请勿泄露给他人。</p>
            <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
              如果您没有进行此操作，请忽略此邮件。
            </p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log(`✓ 验证码已发送到 ${email}`)
    return true
  } catch (error) {
    console.error('✗ 邮件发送失败:', error.message)
    return false
  }
}

/**
 * 发送匹配结果
 */
const sendMatchResult = async (email, matchInfo) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'npu-date@example.com',
      to: email,
      subject: '西联计划 - 您的匹配结果已出炉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; border-radius: 8px;">
          <div style="background: #fff; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0;">🎉 匹配成功</h2>
            <p style="color: #666; font-size: 14px;">恭喜！我们为您找到了志同道合的伙伴。</p>
            
            <div style="background: #f0f0f0; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px;">匹配伙伴</p>
              <p style="margin: 0; font-size: 16px; color: #333; font-weight: bold;">${matchInfo.matchName}</p>
              <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">${matchInfo.matchSchool} · ${matchInfo.matchGender}</p>
            </div>
            
            <div style="background: #f0f0f0; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #999; font-size: 12px;">匹配度</p>
              <p style="margin: 0; font-size: 24px; color: #333; font-weight: bold;">${matchInfo.matchScore}%</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">登录平台查看更多信息并与伙伴联系。</p>
            <a href="${process.env.APP_URL || 'http://localhost:3000'}" style="display: inline-block; background: #000; color: #fff; padding: 10px 30px; border-radius: 4px; text-decoration: none; margin-top: 20px;">进入平台</a>
            
            <p style="color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
              祝您交友愉快！
            </p>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log(`✓ 匹配结果已发送到 ${email}`)
    return true
  } catch (error) {
    console.error('✗ 邮件发送失败:', error.message)
    return false
  }
}

module.exports = {
  sendVerificationCode,
  sendMatchResult
}
