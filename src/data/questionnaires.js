// 问卷题目配置 - 与前端 mock 数据保持一致

// 基础问卷
const baseQuestionnaire = {
  questions: [
    {
      id: 1,
      type: 'radio',
      title: '你的性别',
      key: 'gender',
      required: true,
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '不限', value: 'any' }
      ]
    },
    {
      id: 2,
      type: 'radio',
      title: '期望对象的性别',
      key: 'preferGender',
      required: true,
      options: [
        { label: '男', value: 'male' },
        { label: '女', value: 'female' },
        { label: '不限', value: 'any' }
      ]
    },
    {
      id: 3,
      type: 'range',
      title: '年龄范围',
      key: 'ageRange',
      required: true,
      min: 18,
      max: 45,
      step: 1,
      minGap: 1,
      unit: '岁'
    },
    {
      id: 4,
      type: 'radio',
      title: '身份',
      key: 'identity',
      required: true,
      options: [
        { label: '在读本科', value: 'undergraduate' },
        { label: '在读硕士', value: 'master' },
        { label: '在读博士', value: 'doctor' },
        { label: '教职工', value: 'staff' },
        { label: '校友', value: 'alumni' },
        { label: '保密', value: 'secret' }
      ]
    },
    {
      id: 5,
      type: 'region',
      title: '现居地',
      key: 'currentLocation',
      required: true,
      showPreview: true
    },
    {
      id: 6,
      type: 'radio',
      title: '所在校区',
      key: 'location',
      required: true,
      options: [
        { label: '友谊校区', value: '友谊校区' },
        { label: '长安校区', value: '长安校区' },
        { label: '不限', value: 'any' }
      ]
    },
    {
      id: 7,
      type: 'textarea',
      title: '自我介绍',
      key: 'bio',
      required: true,
      placeholder: '请介绍一下自己，让TA更好地了解你~',
      maxLength: 200
    },
    {
      id: 8,
      type: 'radio',
      title: '你希望在这里寻找？',
      key: 'lookingFor',
      required: true,
      options: [
        { label: '对象', value: 'date' },
        { label: '搭子', value: 'buddy' }
      ]
    }
  ]
}

// 约会问卷
const dateQuestionnaire = {
  type: 'date',
  questions: [
    {
      id: 1,
      type: 'range',
      title: '期望对方身高范围(cm)',
      key: 'heightRange',
      required: false,
      min: 120,
      max: 220,
      step: 1,
      minGap: 5,
      unit: 'cm',
      defaultMin: 155,
      defaultMax: 185
    },
    {
      id: 2,
      type: 'range',
      title: '期望对方年龄范围',
      key: 'ageRange',
      required: false,
      min: 18,
      max: 35,
      step: 1,
      minGap: 1,
      unit: '岁',
      defaultMin: 19,
      defaultMax: 29
    },
    {
      id: 3,
      type: 'checkbox',
      title: '期望对方年级',
      key: 'preferGrade',
      required: false,
      options: [
        { label: '2020级', value: '2020' },
        { label: '2021级', value: '2021' },
        { label: '2022级', value: '2022' },
        { label: '2023级', value: '2023' },
        { label: '2024级', value: '2024' }
      ]
    },
    {
      id: 4,
      type: 'checkbox',
      title: '期望对方专业',
      key: 'preferMajor',
      required: false,
      options: [
        { label: '计算机科学与技术', value: '计算机科学与技术' },
        { label: '软件工程', value: '软件工程' },
        { label: '电子信息工程', value: '电子信息工程' },
        { label: '机械工程', value: '机械工程' },
        { label: '自动化', value: '自动化' },
        { label: '材料科学与工程', value: '材料科学与工程' },
        { label: '飞行器设计与工程', value: '飞行器设计与工程' },
        { label: '信息管理与信息系统', value: '信息管理与信息系统' },
        { label: '工商管理', value: '工商管理' },
        { label: '不限', value: '不限' }
      ]
    },
    {
      id: 5,
      type: 'radio',
      title: '是否颜控',
      key: 'appearanceFirst',
      required: false,
      options: [
        { label: '是', value: true },
        { label: '否，更看重内在', value: false }
      ]
    },
    {
      id: 6,
      type: 'checkbox',
      title: '你在意对方的条件',
      key: 'preferences',
      required: false,
      options: [
        { label: '身高', value: 'height' },
        { label: '学历', value: 'education' },
        { label: '专业', value: 'major' },
        { label: '兴趣爱好', value: 'hobbies' },
        { label: '性格', value: 'personality' },
        { label: '家乡', value: 'hometown' },
        { label: '只要有缘', value: 'fate' }
      ]
    },
    {
      id: 7,
      type: 'checkbox',
      title: '期望对方性格',
      key: 'preferPersonality',
      required: false,
      options: [
        { label: '开朗外向', value: '开朗外向' },
        { label: '成熟稳重', value: '成熟稳重' },
        { label: '文静内敛', value: '文静内敛' },
        { label: '幽默风趣', value: '幽默风趣' },
        { label: '温柔体贴', value: '温柔体贴' },
        { label: '独立自强', value: '独立自强' }
      ]
    },
    {
      id: 8,
      type: 'checkbox',
      title: '期望对方兴趣爱好',
      key: 'preferHobbies',
      required: false,
      options: [
        { label: '运动', value: '运动' },
        { label: '阅读', value: '阅读' },
        { label: '旅游', value: '旅游' },
        { label: '摄影', value: '摄影' },
        { label: '绘画', value: '绘画' },
        { label: '音乐', value: '音乐' },
        { label: '电影', value: '电影' },
        { label: '美食', value: '美食' },
        { label: '游戏', value: '游戏' }
      ]
    },
    {
      id: 9,
      type: 'checkbox',
      title: '期望对方学历背景',
      key: 'preferEducation',
      required: false,
      options: [
        { label: '本科', value: 'undergraduate' },
        { label: '硕士', value: 'master' },
        { label: '博士', value: 'doctor' },
        { label: '不限', value: 'any' }
      ]
    },
    {
      id: 10,
      type: 'textarea',
      title: '对理想对象的描述',
      key: 'idealPartnerDescription',
      required: false,
      placeholder: '描述你心目中理想对象的样子...',
      maxLength: 300
    }
  ]
}

// 搭子问卷
const buddyQuestionnaire = {
  type: 'buddy',
  questions: [
    {
      id: 1,
      type: 'checkbox',
      title: '你想找什么类型的搭子',
      key: 'buddyType',
      required: true,
      options: [
        { label: '学习搭子', value: 'study' },
        { label: '健身搭子', value: 'fitness' },
        { label: '旅游搭子', value: 'travel' },
        { label: '美食搭子', value: 'food' },
        { label: '游戏搭子', value: 'game' },
        { label: '电影搭子', value: 'movie' },
        { label: '逛街搭子', value: 'shopping' },
        { label: '其他', value: 'other' }
      ]
    },
    {
      id: 2,
      type: 'checkbox',
      title: '搭子应具备的特点',
      key: 'buddyTraits',
      required: false,
      options: [
        { label: '有责任心', value: 'responsible' },
        { label: '有趣味', value: 'fun' },
        { label: '可靠', value: 'reliable' },
        { label: '有共同话题', value: 'common_interest' },
        { label: '讲诚信', value: 'trustworthy' },
        { label: '够坦诚', value: 'honest' }
      ]
    },
    {
      id: 3,
      type: 'textarea',
      title: '介绍一下你自己和你想找的搭子',
      key: 'buddyDescription',
      required: false,
      placeholder: '描述你的性格、兴趣和期望的搭子类型...',
      maxLength: 300
    }
  ]
}

// MBTI 问卷 - 16 题简化版
const mbtiQuestionnaire = {
  type: 'mbti',
  questions: [
    {
      id: 1,
      key: 'q1',
      dimension: 'EI',
      type: 'radio',
      title: '在社交场合，你通常：',
      options: [
        { value: 'E', label: '主动和陌生人聊天，很容易融入' },
        { value: 'I', label: '更喜欢与熟人交流，陌生环境会感到疲惫' }
      ]
    },
    {
      id: 2,
      key: 'q2',
      dimension: 'EI',
      type: 'radio',
      title: '你的日常精力来源是：',
      options: [
        { value: 'E', label: '与他人互动、参加活动' },
        { value: 'I', label: '独处、思考、阅读' }
      ]
    },
    {
      id: 3,
      key: 'q3',
      dimension: 'SN',
      type: 'radio',
      title: '在处理问题时，你更重视：',
      options: [
        { value: 'S', label: '具体的事实和现实细节' },
        { value: 'N', label: '模式、联系和未来可能性' }
      ]
    },
    {
      id: 4,
      key: 'q4',
      dimension: 'SN',
      type: 'radio',
      title: '你更容易注意到：',
      options: [
        { value: 'S', label: '事物的实际情况和现状' },
        { value: 'N', label: '事物可能发展的方向和意义' }
      ]
    },
    {
      id: 5,
      key: 'q5',
      dimension: 'TF',
      type: 'radio',
      title: '做决定时，你更看重：',
      options: [
        { value: 'T', label: '逻辑分析和客观事实' },
        { value: 'F', label: '个人价值观和他人感受' }
      ]
    },
    {
      id: 6,
      key: 'q6',
      dimension: 'TF',
      type: 'radio',
      title: '工作中的冲突，你倾向于：',
      options: [
        { value: 'T', label: '直接指出问题所在，寻求最优解' },
        { value: 'F', label: '先考虑他人感受，努力维持关系' }
      ]
    },
    {
      id: 7,
      key: 'q7',
      dimension: 'JP',
      type: 'radio',
      title: '你的生活风格更像是：',
      options: [
        { value: 'J', label: '有计划、有结构、井井有条' },
        { value: 'P', label: '灵活、随遇而安、充满变化' }
      ]
    },
    {
      id: 8,
      key: 'q8',
      dimension: 'JP',
      type: 'radio',
      title: '对于截止日期，你通常：',
      options: [
        { value: 'J', label: '提前完成，然后继续改进' },
        { value: 'P', label: '在最后期限前完成就行' }
      ]
    },
    {
      id: 9,
      key: 'q9',
      dimension: 'EI',
      type: 'radio',
      title: '假期或休闲时间，你更喜欢：',
      options: [
        { value: 'E', label: '和朋友一起出去玩、参加活动' },
        { value: 'I', label: '自己在家休息、做自己喜欢的事' }
      ]
    },
    {
      id: 10,
      key: 'q10',
      dimension: 'SN',
      type: 'radio',
      title: '学习新东西时，你更想要：',
      options: [
        { value: 'S', label: '实际可用的技能和具体步骤' },
        { value: 'N', label: '深层理论和核心概念' }
      ]
    },
    {
      id: 11,
      key: 'q11',
      dimension: 'TF',
      type: 'radio',
      title: '面对朋友的困难，你会：',
      options: [
        { value: 'T', label: '分析问题、给出建议' },
        { value: 'F', label: '倾听、表达同情和支持' }
      ]
    },
    {
      id: 12,
      key: 'q12',
      dimension: 'JP',
      type: 'radio',
      title: '对于改变和不确定性，你：',
      options: [
        { value: 'J', label: '更希望提前知道，好作出计划' },
        { value: 'P', label: '相对来说比较能接受和适应' }
      ]
    },
    {
      id: 13,
      key: 'q13',
      dimension: 'EI',
      type: 'radio',
      title: '在团队中，你通常会：',
      options: [
        { value: 'E', label: '主动参与讨论和活动' },
        { value: 'I', label: '认真倾听，选择性地参与' }
      ]
    },
    {
      id: 14,
      key: 'q14',
      dimension: 'SN',
      type: 'radio',
      title: '你更容易相信：',
      options: [
        { value: 'S', label: '眼睛看到的、经历过的' },
        { value: 'N', label: '直觉和第六感' }
      ]
    },
    {
      id: 15,
      key: 'q15',
      dimension: 'TF',
      type: 'radio',
      title: '在竞争中，你会：',
      options: [
        { value: 'T', label: '专注于赢，追求最佳成绩' },
        { value: 'F', label: '更在乎过程和与他人的互动' }
      ]
    },
    {
      id: 16,
      key: 'q16',
      dimension: 'JP',
      type: 'radio',
      title: '工作时，你通常是：',
      options: [
        { value: 'J', label: '按照计划执行，逐项完成' },
        { value: 'P', label: '根据情况灵活调整' }
      ]
    }
  ]
}

module.exports = {
  baseQuestionnaire,
  dateQuestionnaire,
  buddyQuestionnaire,
  mbtiQuestionnaire
}
