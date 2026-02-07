/**
 * 天气数据模拟工具
 * 生成模拟天气数据用于演示
 */

const WEATHER_TYPES = [
  { type: 'sunny', name: '晴天', icon: '☀️' },
  { type: 'cloudy', name: '多云', icon: '⛅' },
  { type: 'overcast', name: '阴天', icon: '☁️' },
  { type: 'rainy', name: '小雨', icon: '🌧️' },
  { type: 'heavy-rain', name: '大雨', icon: '⛈️' },
  { type: 'snowy', name: '下雪', icon: '❄️' },
];

const DRESS_SUGGESTIONS = {
  hot: '天气炎热，建议穿着轻薄透气的衣物，注意防晒',
  warm: '天气温暖，适合穿着舒适的春秋装',
  cool: '天气凉爽，建议穿着长袖外套',
  cold: '天气寒冷，注意保暖，建议穿着厚外套',
  rainy: '今日有雨，记得带伞，建议穿着防水外套',
  snowy: '今日下雪，注意保暖防滑，穿着厚重衣物',
};

/**
 * 根据日期生成模拟天气数据
 */
export function generateWeatherData(date: Date = new Date()) {
  const hash = date.getDate() + date.getMonth() * 31;
  
  // 选择天气类型
  const weatherIndex = hash % WEATHER_TYPES.length;
  const weather = WEATHER_TYPES[weatherIndex];
  
  // 生成温度（根据月份调整基准温度）
  const month = date.getMonth();
  let baseTemp = 20;
  
  if (month >= 11 || month <= 1) {
    baseTemp = 5; // 冬季
  } else if (month >= 2 && month <= 4) {
    baseTemp = 15; // 春季
  } else if (month >= 5 && month <= 7) {
    baseTemp = 30; // 夏季
  } else {
    baseTemp = 18; // 秋季
  }
  
  const tempVariation = (hash % 10) - 5;
  const currentTemp = baseTemp + tempVariation;
  const highTemp = currentTemp + (hash % 5) + 2;
  const lowTemp = currentTemp - (hash % 5) - 2;
  
  // 生成其他天气参数
  const humidity = 40 + (hash % 40); // 40-80%
  const windSpeed = 5 + (hash % 20); // 5-25 km/h
  const aqi = 30 + (hash % 150); // 30-180
  
  // 空气质量等级
  let aqiLevel = '优';
  let aqiColor = '#22C55E';
  if (aqi > 150) {
    aqiLevel = '重度污染';
    aqiColor = '#EF4444';
  } else if (aqi > 100) {
    aqiLevel = '轻度污染';
    aqiColor = '#F59E0B';
  } else if (aqi > 50) {
    aqiLevel = '良';
    aqiColor = '#FBBF24';
  }
  
  // 穿搭建议
  let dressSuggestion = DRESS_SUGGESTIONS.warm;
  if (weather.type === 'rainy' || weather.type === 'heavy-rain') {
    dressSuggestion = DRESS_SUGGESTIONS.rainy;
  } else if (weather.type === 'snowy') {
    dressSuggestion = DRESS_SUGGESTIONS.snowy;
  } else if (currentTemp > 28) {
    dressSuggestion = DRESS_SUGGESTIONS.hot;
  } else if (currentTemp > 20) {
    dressSuggestion = DRESS_SUGGESTIONS.warm;
  } else if (currentTemp > 10) {
    dressSuggestion = DRESS_SUGGESTIONS.cool;
  } else {
    dressSuggestion = DRESS_SUGGESTIONS.cold;
  }
  
  // 紫外线指数
  const uvIndex = weather.type === 'sunny' ? 7 + (hash % 4) : 2 + (hash % 5);
  let uvLevel = '弱';
  if (uvIndex > 7) {
    uvLevel = '强';
  } else if (uvIndex > 4) {
    uvLevel = '中等';
  }
  
  return {
    weather: {
      type: weather.type,
      name: weather.name,
      icon: weather.icon,
    },
    temperature: {
      current: Math.round(currentTemp),
      high: Math.round(highTemp),
      low: Math.round(lowTemp),
    },
    details: {
      humidity,
      windSpeed,
      aqi,
      aqiLevel,
      aqiColor,
      uvIndex,
      uvLevel,
    },
    suggestion: {
      dress: dressSuggestion,
    },
    location: '北京', // 默认位置
  };
}
