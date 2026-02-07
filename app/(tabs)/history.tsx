import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { generateHuangliData } from "@/lib/huangli-data";
import { useColors } from "@/hooks/use-colors";

export default function HistoryScreen() {
  const colors = useColors();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // 生成日历数据
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const calendar: (number | null)[] = [];
    
    // 填充月初空白
    for (let i = 0; i < startDayOfWeek; i++) {
      calendar.push(null);
    }
    
    // 填充日期
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push(i);
    }

    return calendar;
  };

  const calendar = generateCalendar();
  const selectedHuangli = generateHuangliData(selectedDate);

  const isToday = (day: number | null) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number | null) => {
    if (!day) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  const handleDateSelect = (day: number | null) => {
    if (!day) return;
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Text key={i} style={{ fontSize: 14 }}>
        {i < score ? '⭐' : '☆'}
      </Text>
    ));
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* 顶部标题 */}
        <View className="px-6 py-4 border-b border-border">
          <Text className="text-foreground text-2xl font-bold">历史记录</Text>
        </View>

        {/* 月份选择器 */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity
            onPress={handlePrevMonth}
            className="p-2 active:opacity-60"
          >
            <Text className="text-primary text-xl font-bold">←</Text>
          </TouchableOpacity>
          <Text className="text-foreground text-lg font-semibold">
            {currentYear}年 {monthNames[currentMonth]}
          </Text>
          <TouchableOpacity
            onPress={handleNextMonth}
            className="p-2 active:opacity-60"
          >
            <Text className="text-primary text-xl font-bold">→</Text>
          </TouchableOpacity>
        </View>

        {/* 日历网格 */}
        <View className="px-4">
          <View className="bg-surface rounded-2xl p-4 border border-border">
            {/* 星期标题 */}
            <View className="flex-row mb-2">
              {weekDays.map((day, index) => (
                <View key={index} className="flex-1 items-center py-2">
                  <Text className="text-muted text-sm font-medium">{day}</Text>
                </View>
              ))}
            </View>

            {/* 日期网格 */}
            <View className="flex-row flex-wrap">
              {calendar.map((day, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleDateSelect(day)}
                  disabled={!day}
                  className="w-[14.28%] aspect-square items-center justify-center"
                  style={{ opacity: day ? 1 : 0 }}
                >
                  <View
                    className={`w-10 h-10 items-center justify-center rounded-full ${
                      isSelected(day)
                        ? 'bg-primary'
                        : isToday(day)
                        ? 'bg-primary/20'
                        : ''
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        isSelected(day)
                          ? 'text-white font-bold'
                          : isToday(day)
                          ? 'text-primary font-semibold'
                          : 'text-foreground'
                      }`}
                    >
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* 选中日期的运势信息 */}
        <View className="px-4 mt-6">
          <Text className="text-foreground text-lg font-semibold mb-3">
            {selectedDate.toLocaleDateString('zh-CN', { 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </Text>

          {/* 运势评分 */}
          <View className="bg-surface rounded-2xl p-6 mb-4 border border-border">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-foreground text-base font-semibold">综合运势</Text>
              <View className="flex-row">
                {renderStars(selectedHuangli.fortune.score)}
              </View>
            </View>

            {/* 宜忌 */}
            <View className="flex-row">
              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-2">
                  <Text className="text-xl mr-1">✅</Text>
                  <Text className="text-foreground text-sm font-semibold">宜</Text>
                </View>
                {selectedHuangli.fortune.yi.slice(0, 3).map((item, index) => (
                  <Text key={index} className="text-muted text-xs mb-1">
                    • {item}
                  </Text>
                ))}
              </View>
              <View className="flex-1 ml-2">
                <View className="flex-row items-center mb-2">
                  <Text className="text-xl mr-1">⛔</Text>
                  <Text className="text-foreground text-sm font-semibold">忌</Text>
                </View>
                {selectedHuangli.fortune.ji.slice(0, 3).map((item, index) => (
                  <Text key={index} className="text-muted text-xs mb-1">
                    • {item}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {/* 程序员建议 */}
          <View className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
            <Text className="text-foreground text-base font-semibold mb-3">程序员建议</Text>
            <View className="mb-2">
              <Text className="text-muted text-xs mb-1">幸运语言</Text>
              <Text className="text-foreground text-sm font-medium">
                {selectedHuangli.programmer.luckyLanguage}
              </Text>
            </View>
            <View>
              <Text className="text-muted text-xs mb-1">适合代码类型</Text>
              <Text className="text-foreground text-sm font-medium">
                {selectedHuangli.programmer.codeType}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
