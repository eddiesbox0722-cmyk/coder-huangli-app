import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { generateDetailedFortune } from "@/lib/huangli-data";
import { router } from "expo-router";

export default function FortuneDetailScreen() {
  const [fortuneData] = useState(generateDetailedFortune());

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Text key={i} style={{ fontSize: 16 }}>
        {i < score ? '⭐' : '☆'}
      </Text>
    ));
  };

  const getLuckColor = (luck: string) => {
    switch (luck) {
      case '吉':
        return 'text-success';
      case '凶':
        return 'text-error';
      default:
        return 'text-muted';
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* 顶部导航 */}
        <View className="flex-row items-center px-6 py-4 border-b border-border">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 active:opacity-60"
          >
            <Text className="text-primary text-base">← 返回</Text>
          </TouchableOpacity>
          <Text className="text-foreground text-lg font-semibold">详细运势</Text>
        </View>

        {/* 四大运势 */}
        <View className="px-4 pt-6">
          <Text className="text-foreground text-xl font-bold mb-4">运势详解</Text>
          {fortuneData.aspects.map((aspect, index) => (
            <View key={index} className="bg-surface rounded-2xl p-6 mb-4 border border-border">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-foreground text-lg font-semibold">
                  {aspect.name}
                </Text>
                <View className="flex-row">
                  {renderStars(aspect.score)}
                </View>
              </View>
              <Text className="text-muted text-sm leading-relaxed">
                {aspect.description}
              </Text>
            </View>
          ))}
        </View>

        {/* 时辰吉凶 */}
        <View className="px-4 mt-4">
          <Text className="text-foreground text-xl font-bold mb-4">时辰吉凶</Text>
          <View className="bg-surface rounded-2xl p-6 border border-border">
            {fortuneData.timeSlots.map((slot, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between py-3 ${
                  index < fortuneData.timeSlots.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <Text className="text-foreground text-base">{slot.time}</Text>
                <View
                  className={`px-4 py-1 rounded-full ${
                    slot.luck === '吉'
                      ? 'bg-success/20'
                      : slot.luck === '凶'
                      ? 'bg-error/20'
                      : 'bg-muted/20'
                  }`}
                >
                  <Text className={`text-sm font-medium ${getLuckColor(slot.luck)}`}>
                    {slot.luck}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 温馨提示 */}
        <View className="mx-4 mt-6 bg-primary/10 rounded-2xl p-6 border border-primary/20">
          <Text className="text-foreground text-base font-semibold mb-2">温馨提示</Text>
          <Text className="text-muted text-sm leading-relaxed">
            运势仅供参考，实际情况还需结合个人努力和实际环境。保持积极心态，理性看待运势预测。
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
