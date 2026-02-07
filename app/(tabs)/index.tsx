import { ScrollView, Text, View, TouchableOpacity, RefreshControl } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { generateHuangliData } from "@/lib/huangli-data";
import { fetchWeatherData, type WeatherData } from "@/lib/weather-api";
import { generateWeatherData } from "@/lib/weather-data";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";

export default function HomeScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const [huangliData, setHuangliData] = useState(generateHuangliData());
  const [weatherData, setWeatherData] = useState<WeatherData>(generateWeatherData());
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  const loadWeatherData = async () => {
    try {
      const weather = await fetchWeatherData('Beijing');
      setWeatherData(weather);
    } catch (error) {
      console.error('获取天气数据失败:', error);
      setWeatherData(generateWeatherData());
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const newDate = new Date();
    setHuangliData(generateHuangliData(newDate));
    await loadWeatherData();
    setRefreshing(false);
  };

  useEffect(() => {
    // 初始加载天气数据
    loadWeatherData();

    // 每天0点自动刷新
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timer = setTimeout(() => {
      onRefresh();
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Text key={i} style={{ fontSize: 20 }}>
        {i < score ? '⭐' : '☆'}
      </Text>
    ));
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 顶部日期区域 */}
        <View className="bg-primary px-6 py-8">
          <Text className="text-white text-3xl font-bold mb-2">
            {new Date().getDate()}
          </Text>
          <Text className="text-white/90 text-base">
            {huangliData.date.gregorian}
          </Text>
          <Text className="text-white/80 text-sm mt-1">
            {huangliData.date.lunar}
          </Text>
        </View>

        {/* 综合运势评分 */}
        <View className="bg-surface mx-4 -mt-6 rounded-2xl p-6 shadow-sm border border-border">
          <Text className="text-foreground text-lg font-semibold mb-3">今日运势</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row">
              {renderStars(huangliData.fortune.score)}
            </View>
            <TouchableOpacity
              onPress={() => router.push('/fortune-detail')}
              className="bg-primary px-4 py-2 rounded-full active:opacity-80"
            >
              <Text className="text-white text-sm font-medium">查看详情</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 今日宜忌 */}
        <View className="mx-4 mt-4">
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-2">
                  <Text className="text-2xl mr-2">✅</Text>
                  <Text className="text-foreground font-semibold">宜</Text>
                </View>
                {huangliData.fortune.yi.map((item, index) => (
                  <Text key={index} className="text-muted text-sm mb-1">
                    • {item}
                  </Text>
                ))}
              </View>
              <View className="flex-1 ml-2">
                <View className="flex-row items-center mb-2">
                  <Text className="text-2xl mr-2">⛔</Text>
                  <Text className="text-foreground font-semibold">忌</Text>
                </View>
                {huangliData.fortune.ji.map((item, index) => (
                  <Text key={index} className="text-muted text-sm mb-1">
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 天气信息卡片 */}
        <View className="mx-4 mt-4">
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <Text className="text-4xl mr-3">{weatherData.weather.icon}</Text>
                <View>
                  <Text className="text-foreground text-lg font-semibold">
                    {weatherData.weather.name}
                  </Text>
                  <Text className="text-muted text-sm">{weatherData.location}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-foreground text-3xl font-bold">
                  {weatherData.temperature.current}°
                </Text>
                <Text className="text-muted text-sm">
                  {weatherData.temperature.low}° / {weatherData.temperature.high}°
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between pt-4 border-t border-border">
              <View className="items-center">
                <Text className="text-muted text-xs mb-1">湿度</Text>
                <Text className="text-foreground text-sm font-medium">
                  {weatherData.details.humidity}%
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-muted text-xs mb-1">风速</Text>
                <Text className="text-foreground text-sm font-medium">
                  {weatherData.details.windSpeed}km/h
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-muted text-xs mb-1">空气质量</Text>
                <Text className="text-foreground text-sm font-medium">
                  {weatherData.details.aqiLevel}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-muted text-xs mb-1">紫外线</Text>
                <Text className="text-foreground text-sm font-medium">
                  {weatherData.details.uvLevel}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 穿搭建议卡片 */}
        <View className="mx-4 mt-4">
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-2">👔</Text>
              <Text className="text-foreground text-lg font-semibold">穿搭建议</Text>
            </View>
            <View className="mb-3">
              <Text className="text-muted text-sm mb-1">推荐风格</Text>
              <Text className="text-foreground text-base font-medium">
                {huangliData.lifestyle.dressStyle}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-muted text-sm mb-1">幸运颜色</Text>
              <Text className="text-foreground text-base font-medium">
                {huangliData.lifestyle.luckyColor}
              </Text>
            </View>
            <View className="bg-background rounded-lg p-3">
              <Text className="text-muted text-sm leading-relaxed">
                {weatherData.suggestion.dress}
              </Text>
            </View>
          </View>
        </View>

        {/* 工作位置建议卡片 */}
        <View className="mx-4 mt-4">
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <View className="flex-row items-center mb-3">
              <Text className="text-2xl mr-2">📍</Text>
              <Text className="text-foreground text-lg font-semibold">工作位置</Text>
            </View>
            <View className="mb-3">
              <Text className="text-muted text-sm mb-1">推荐位置</Text>
              <Text className="text-foreground text-base font-medium">
                {huangliData.programmer.workPosition}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-muted text-sm mb-1">最佳工作时段</Text>
              <Text className="text-foreground text-base font-medium">
                {huangliData.programmer.bestWorkTime}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-muted text-sm mb-1">幸运方位</Text>
              <Text className="text-foreground text-base font-medium">
                {huangliData.lifestyle.luckyDirection}
              </Text>
            </View>
          </View>
        </View>

        {/* 程序员特色建议卡片 */}
        <View className="mx-4 mt-4">
          <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-2">💻</Text>
              <Text className="text-foreground text-lg font-semibold">程序员专属</Text>
            </View>
            
            <View className="mb-4">
              <Text className="text-muted text-sm mb-2">今日幸运语言</Text>
              <View className="flex-row items-center justify-between bg-background rounded-lg p-3">
                <Text className="text-foreground text-base font-bold">
                  {huangliData.programmer.luckyLanguage}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-primary text-lg font-bold mr-1">
                    {huangliData.programmer.languageLuck}
                  </Text>
                  <Text className="text-muted text-sm">/10</Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-muted text-sm mb-2">适合的代码类型</Text>
              <View className="bg-background rounded-lg p-3">
                <Text className="text-foreground text-base">
                  {huangliData.programmer.codeType}
                </Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-muted text-sm mb-2">Bug出现概率</Text>
              <View className="bg-background rounded-lg p-3">
                <View className="flex-row items-center">
                  <View className="flex-1 bg-border rounded-full h-2 mr-3">
                    <View
                      className="bg-warning rounded-full h-2"
                      style={{ width: `${huangliData.programmer.bugProbability}%` }}
                    />
                  </View>
                  <Text className="text-foreground text-sm font-medium">
                    {huangliData.programmer.bugProbability}%
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text className="text-muted text-sm mb-2">今日适合</Text>
              <View className="flex-row flex-wrap">
                {huangliData.programmer.suitable.meeting && (
                  <View className="bg-success/20 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-success text-sm">开会讨论</Text>
                  </View>
                )}
                {huangliData.programmer.suitable.codeReview && (
                  <View className="bg-success/20 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-success text-sm">Code Review</Text>
                  </View>
                )}
                {huangliData.programmer.suitable.deploy && (
                  <View className="bg-success/20 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-success text-sm">上线部署</Text>
                  </View>
                )}
                {!huangliData.programmer.suitable.meeting && 
                 !huangliData.programmer.suitable.codeReview && 
                 !huangliData.programmer.suitable.deploy && (
                  <View className="bg-warning/20 rounded-full px-3 py-1">
                    <Text className="text-warning text-sm">专注编码</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
