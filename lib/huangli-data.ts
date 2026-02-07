/**
 * 皇历数据生成工具
 * 基于日期生成传统皇历信息
 */

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 生肖
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 宜做的事
const YI_ITEMS = [
  '写代码', '提交代码', '上线部署', '代码审查', '重构代码', 
  '学习新技术', '写文档', '修复Bug', '优化性能', '开会讨论',
  '设计架构', '写单元测试', '更新依赖', '清理代码', '备份数据'
];

// 忌做的事
const JI_ITEMS = [
  '删库', '强制推送', '直接修改生产环境', '跳过测试', '忽略警告',
  '硬编码密码', '不写注释', '复制粘贴代码', '提交未测试代码', '忽略代码审查',
  '随意修改配置', '不备份就删除', '在主分支直接开发', '忽略安全漏洞', '过度优化'
];

// 编程语言
const LANGUAGES = [
  'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 
  'Rust', 'C++', 'Swift', 'Kotlin', 'Ruby'
];

// 工作位置
const WORK_POSITIONS = [
  '靠窗位置', '角落安静处', '开放工作区', '会议室', '咖啡厅',
  '家里书房', '阳台', '图书馆', '共享办公空间', '户外露台'
];

// 穿搭风格
const DRESS_STYLES = [
  '休闲舒适', '商务正装', '运动风', '极简风', '潮流街头',
  '文艺范', '科技感', '复古风', '学院风', '工装风'
];

// 幸运颜色
const LUCKY_COLORS = [
  '紫色', '蓝色', '绿色', '橙色', '红色', 
  '黄色', '黑色', '白色', '灰色', '粉色'
];

/**
 * 根据日期生成哈希值
 */
function dateHash(date: Date): number {
  const str = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * 根据哈希值和种子选择数组元素
 */
function selectByHash(arr: string[], hash: number, seed: number = 0): string {
  const index = (hash + seed) % arr.length;
  return arr[index];
}

/**
 * 根据哈希值选择多个不重复的数组元素
 */
function selectMultipleByHash(arr: string[], hash: number, count: number, seed: number = 0): string[] {
  const result: string[] = [];
  const used = new Set<number>();
  
  for (let i = 0; i < count && result.length < arr.length; i++) {
    let index = (hash + seed + i * 7) % arr.length;
    let attempts = 0;
    
    while (used.has(index) && attempts < arr.length) {
      index = (index + 1) % arr.length;
      attempts++;
    }
    
    if (!used.has(index)) {
      used.add(index);
      result.push(arr[index]);
    }
  }
  
  return result;
}

/**
 * 计算农历信息（简化版）
 */
function getLunarDate(date: Date): string {
  // 简化实现：使用公历日期模拟农历
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 计算天干地支年
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  const ganZhiYear = TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
  const shengXiao = SHENG_XIAO[zhiIndex];
  
  // 简化的农历月日（实际应使用农历算法）
  const lunarMonth = ((month + 1) % 12) || 12;
  const lunarDay = ((day + 5) % 30) || 30;
  
  return `${ganZhiYear}年 ${shengXiao}年 ${lunarMonth}月${lunarDay}日`;
}

/**
 * 生成运势评分（1-5星）
 */
function getFortuneScore(hash: number): number {
  return (hash % 5) + 1;
}

/**
 * 生成今日皇历数据
 */
export function generateHuangliData(date: Date = new Date()) {
  const hash = dateHash(date);
  
  // 基础信息
  const lunar = getLunarDate(date);
  const fortuneScore = getFortuneScore(hash);
  
  // 宜忌
  const yi = selectMultipleByHash(YI_ITEMS, hash, 5, 1);
  const ji = selectMultipleByHash(JI_ITEMS, hash, 5, 2);
  
  // 程序员特色
  const luckyLanguage = selectByHash(LANGUAGES, hash, 3);
  const languageLuck = (hash % 10) + 1; // 1-10分
  
  const codeType = selectByHash([
    '前端界面开发', '后端API开发', '算法优化', '代码重构',
    '数据库设计', '性能调优', '安全加固', '测试用例编写'
  ], hash, 4);
  
  const bugProbability = (hash % 30) + 10; // 10-40%
  
  // 工作建议
  const bestWorkTime = selectByHash([
    '早晨 9:00-11:00', '上午 10:00-12:00', '下午 14:00-16:00',
    '下午 15:00-17:00', '晚上 20:00-22:00', '深夜 23:00-1:00'
  ], hash, 5);
  
  const workPosition = selectByHash(WORK_POSITIONS, hash, 6);
  
  const meetingSuitable = (hash % 10) > 5;
  const codeReviewSuitable = (hash % 10) > 4;
  const deploySuitable = (hash % 10) > 6;
  
  // 穿搭建议
  const dressStyle = selectByHash(DRESS_STYLES, hash, 7);
  const luckyColor = selectByHash(LUCKY_COLORS, hash, 8);
  
  // 幸运数字和方位
  const luckyNumber = (hash % 10);
  const luckyDirection = selectByHash(['东', '南', '西', '北', '东南', '西南', '东北', '西北'], hash, 9);
  
  return {
    date: {
      gregorian: date.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      }),
      lunar,
    },
    fortune: {
      score: fortuneScore,
      yi,
      ji,
    },
    programmer: {
      luckyLanguage,
      languageLuck,
      codeType,
      bugProbability,
      bestWorkTime,
      workPosition,
      suitable: {
        meeting: meetingSuitable,
        codeReview: codeReviewSuitable,
        deploy: deploySuitable,
      },
    },
    lifestyle: {
      dressStyle,
      luckyColor,
      luckyNumber,
      luckyDirection,
    },
  };
}

/**
 * 生成详细运势
 */
export function generateDetailedFortune(date: Date = new Date()) {
  const hash = dateHash(date);
  
  const aspects = [
    {
      name: '事业运',
      score: (hash % 5) + 1,
      description: selectByHash([
        '今日工作顺利，适合推进重要项目',
        '可能遇到一些挑战，保持耐心',
        '团队协作运势佳，多与同事沟通',
        '创意灵感丰富，适合头脑风暴',
        '注意细节，避免粗心大意'
      ], hash, 10),
    },
    {
      name: '财运',
      score: ((hash + 1) % 5) + 1,
      description: selectByHash([
        '财运平稳，适合理性消费',
        '可能有意外收入，保持关注',
        '投资需谨慎，不宜冒险',
        '适合学习理财知识',
        '收入稳定，可考虑小额投资'
      ], hash, 11),
    },
    {
      name: '健康运',
      score: ((hash + 2) % 5) + 1,
      description: selectByHash([
        '注意休息，避免过度劳累',
        '适合户外运动，增强体质',
        '饮食清淡，多喝水',
        '保持良好作息，早睡早起',
        '注意用眼健康，适当休息'
      ], hash, 12),
    },
    {
      name: '感情运',
      score: ((hash + 3) % 5) + 1,
      description: selectByHash([
        '人际关系和谐，适合社交',
        '多关心身边的人',
        '保持真诚，避免误会',
        '单身者桃花运佳',
        '情侣感情稳定，可增进了解'
      ], hash, 13),
    },
  ];
  
  // 时辰吉凶
  const timeSlots = [
    { time: '子时 (23:00-01:00)', luck: selectByHash(['吉', '平', '凶'], hash, 20) },
    { time: '丑时 (01:00-03:00)', luck: selectByHash(['吉', '平', '凶'], hash, 21) },
    { time: '寅时 (03:00-05:00)', luck: selectByHash(['吉', '平', '凶'], hash, 22) },
    { time: '卯时 (05:00-07:00)', luck: selectByHash(['吉', '平', '凶'], hash, 23) },
    { time: '辰时 (07:00-09:00)', luck: selectByHash(['吉', '平', '凶'], hash, 24) },
    { time: '巳时 (09:00-11:00)', luck: selectByHash(['吉', '平', '凶'], hash, 25) },
    { time: '午时 (11:00-13:00)', luck: selectByHash(['吉', '平', '凶'], hash, 26) },
    { time: '未时 (13:00-15:00)', luck: selectByHash(['吉', '平', '凶'], hash, 27) },
    { time: '申时 (15:00-17:00)', luck: selectByHash(['吉', '平', '凶'], hash, 28) },
    { time: '酉时 (17:00-19:00)', luck: selectByHash(['吉', '平', '凶'], hash, 29) },
    { time: '戌时 (19:00-21:00)', luck: selectByHash(['吉', '平', '凶'], hash, 30) },
    { time: '亥时 (21:00-23:00)', luck: selectByHash(['吉', '平', '凶'], hash, 31) },
  ];
  
  return {
    aspects,
    timeSlots,
  };
}
