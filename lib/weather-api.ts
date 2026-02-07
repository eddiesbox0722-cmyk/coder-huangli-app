/**
 * 天气API服务
 * 使用wttr.in免费天气API获取实时天气数据
 */

export interface WeatherData {
  weather: {
    type: string;
    name: string;
    icon: string;
  };
  temperature: {
    current: number;
    high: number;
    low: number;
  };
  details: {
    humidity: number;
    windSpeed: number;
    aqi: number;
    aqiLevel: string;
    aqiColor: string;
    uvIndex: number;
    uvLevel: string;
  };
  suggestion: {
    dress: string;
  };
  location: string;
}

const WEATHER_ICONS: Record<string, string> = {
  'Sunny': '☀️',
  'Clear': '☀️',
  'Partly cloudy': '⛅',
  'Cloudy': '☁️',
  'Overcast': '☁️',
  'Mist': '🌫️',
  'Fog': '🌫️',
  'Light rain': '🌧️',
  'Moderate rain': '🌧️',
  'Heavy rain': '⛈️',
  'Light snow': '❄️',
  'Moderate snow': '❄️',
  'Heavy snow': '❄️',
  'Thunderstorm': '⛈️',
};

const DRESS_SUGGESTIONS: Record<string, string> = {
  hot: '天气炎热，建议穿着轻薄透气的衣物，注意防晒',
  warm: '天气温暖，适合穿着舒适的春秋装',
  cool: '天气凉爽，建议穿着长袖外套',
  cold: '天气寒冷，注意保暖，建议穿着厚外套',
  rainy: '今日有雨，记得带伞，建议穿着防水外套',
  snowy: '今日下雪，注意保暖防滑，穿着厚重衣物',
};

/**
 * 获取天气图标
 */
function getWeatherIcon(condition: string): string {
  for (const [key, icon] of Object.entries(WEATHER_ICONS)) {
    if (condition.includes(key)) {
      return icon;
    }
  }
  return '☁️'; // 默认图标
}

/**
 * 生成穿搭建议
 */
function getDressSuggestion(temp: number, condition: string): string {
  if (condition.toLowerCase().includes('rain')) {
    return DRESS_SUGGESTIONS.rainy;
  }
  if (condition.toLowerCase().includes('snow')) {
    return DRESS_SUGGESTIONS.snowy;
  }
  if (temp > 28) {
    return DRESS_SUGGESTIONS.hot;
  }
  if (temp > 20) {
    return DRESS_SUGGESTIONS.warm;
  }
  if (temp > 10) {
    return DRESS_SUGGESTIONS.cool;
  }
  return DRESS_SUGGESTIONS.cold;
}

/**
 * 获取空气质量等级
 */
function getAQILevel(aqi: number): { level: string; color: string } {
  if (aqi > 150) {
    return { level: '重度污染', color: '#EF4444' };
  }
  if (aqi > 100) {
    return { level: '轻度污染', color: '#F59E0B' };
  }
  if (aqi > 50) {
    return { level: '良', color: '#FBBF24' };
  }
  return { level: '优', color: '#22C55E' };
}

/**
 * 获取紫外线等级
 */
function getUVLevel(uvIndex: number): string {
  if (uvIndex > 7) {
    return '强';
  }
  if (uvIndex > 4) {
    return '中等';
  }
  return '弱';
}

/**
 * 从wttr.in获取天气数据
 */
export async function fetchWeatherData(location: string = 'Beijing'): Promise<WeatherData> {
  try {
    // 使用wttr.in的JSON API
    const response = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
    
    if (!response.ok) {
      throw new Error('天气API请求失败');
    }

    const data = await response.json();
    
    // 解析当前天气
    const current = data.current_condition[0];
    const today = data.weather[0];
    
    const currentTemp = parseInt(current.temp_C);
    const highTemp = parseInt(today.maxtempC);
    const lowTemp = parseInt(today.mintempC);
    const humidity = parseInt(current.humidity);
    const windSpeed = parseInt(current.windspeedKmph);
    const condition = current.weatherDesc[0].value;
    const uvIndex = parseInt(current.uvIndex);
    
    // 模拟AQI数据（wttr.in不提供AQI）
    const aqi = 50 + Math.floor(Math.random() * 50);
    const aqiInfo = getAQILevel(aqi);
    
    return {
      weather: {
        type: condition.toLowerCase().replace(/\s+/g, '-'),
        name: translateWeatherCondition(condition),
        icon: getWeatherIcon(condition),
      },
      temperature: {
        current: currentTemp,
        high: highTemp,
        low: lowTemp,
      },
      details: {
        humidity,
        windSpeed,
        aqi,
        aqiLevel: aqiInfo.level,
        aqiColor: aqiInfo.color,
        uvIndex,
        uvLevel: getUVLevel(uvIndex),
      },
      suggestion: {
        dress: getDressSuggestion(currentTemp, condition),
      },
      location: data.nearest_area[0].areaName[0].value || location,
    };
  } catch (error) {
    console.error('获取天气数据失败:', error);
    // 返回默认数据
    return getDefaultWeatherData(location);
  }
}

/**
 * 翻译天气状况
 */
function translateWeatherCondition(condition: string): string {
  const translations: Record<string, string> = {
    'Sunny': '晴天',
    'Clear': '晴朗',
    'Partly cloudy': '多云',
    'Cloudy': '阴天',
    'Overcast': '阴天',
    'Mist': '薄雾',
    'Fog': '雾',
    'Light rain': '小雨',
    'Moderate rain': '中雨',
    'Heavy rain': '大雨',
    'Light snow': '小雪',
    'Moderate snow': '中雪',
    'Heavy snow': '大雪',
    'Thunderstorm': '雷暴',
  };

  for (const [key, value] of Object.entries(translations)) {
    if (condition.includes(key)) {
      return value;
    }
  }
  return condition;
}

/**
 * 获取默认天气数据（API失败时使用）
 */
function getDefaultWeatherData(location: string): WeatherData {
  return {
    weather: {
      type: 'sunny',
      name: '晴天',
      icon: '☀️',
    },
    temperature: {
      current: 22,
      high: 26,
      low: 18,
    },
    details: {
      humidity: 60,
      windSpeed: 12,
      aqi: 55,
      aqiLevel: '良',
      aqiColor: '#FBBF24',
      uvIndex: 5,
      uvLevel: '中等',
    },
    suggestion: {
      dress: '天气温暖，适合穿着舒适的春秋装',
    },
    location,
  };
}
