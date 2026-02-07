import { ScrollView, Text, View, TouchableOpacity, Switch, Platform } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ColorScheme } from "@/constants/theme";

type ThemeMode = 'light' | 'dark' | 'system';

export default function SettingsScreen() {
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // 加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const notification = await AsyncStorage.getItem('notificationEnabled');
      const time = await AsyncStorage.getItem('notificationTime');
      const theme = await AsyncStorage.getItem('themeMode');

      if (notification !== null) {
        setNotificationEnabled(notification === 'true');
      }
      if (time !== null) {
        setNotificationTime(time);
      }
      if (theme !== null) {
        setThemeMode(theme as ThemeMode);
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  };

  const saveSettings = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  };

  const handleNotificationToggle = (value: boolean) => {
    setNotificationEnabled(value);
    saveSettings('notificationEnabled', value.toString());
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveSettings('themeMode', mode);
    
    // 应用主题变更
    if (mode === 'light') {
      setColorScheme('light');
    } else if (mode === 'dark') {
      setColorScheme('dark');
    } else {
      // 跟随系统
      const systemScheme = Platform.OS === 'web' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : 'light';
      setColorScheme(systemScheme as ColorScheme);
    }
  };

  const timeOptions = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00'
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* 顶部标题 */}
        <View className="px-6 py-4 border-b border-border">
          <Text className="text-foreground text-2xl font-bold">设置</Text>
        </View>

        {/* 通知设置 */}
        <View className="px-4 pt-6">
          <Text className="text-muted text-sm font-medium mb-3 px-2">通知设置</Text>
          
          <View className="bg-surface rounded-2xl border border-border overflow-hidden">
            <View className="flex-row items-center justify-between px-6 py-4">
              <View className="flex-1">
                <Text className="text-foreground text-base font-medium mb-1">
                  每日提醒
                </Text>
                <Text className="text-muted text-sm">
                  每天定时推送运势提醒
                </Text>
              </View>
              <Switch
                value={notificationEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={Platform.OS === 'android' ? colors.background : undefined}
              />
            </View>

            {notificationEnabled && (
              <>
                <View className="h-px bg-border mx-6" />
                <View className="px-6 py-4">
                  <Text className="text-foreground text-base font-medium mb-3">
                    提醒时间
                  </Text>
                  <View className="flex-row flex-wrap">
                    {timeOptions.map((time) => (
                      <TouchableOpacity
                        key={time}
                        onPress={() => {
                          setNotificationTime(time);
                          saveSettings('notificationTime', time);
                        }}
                        className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                          notificationTime === time
                            ? 'bg-primary'
                            : 'bg-background border border-border'
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            notificationTime === time ? 'text-white' : 'text-foreground'
                          }`}
                        >
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* 主题设置 */}
        <View className="px-4 pt-6">
          <Text className="text-muted text-sm font-medium mb-3 px-2">外观设置</Text>
          
          <View className="bg-surface rounded-2xl border border-border overflow-hidden">
            <View className="px-6 py-4">
              <Text className="text-foreground text-base font-medium mb-4">
                主题模式
              </Text>
              
              {/* 主题按钮组 */}
              <View className="flex-row gap-2 mb-4">
                {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
                  const isSelected = themeMode === mode;
                  let modeLabel = '';
                  if (mode === 'light') {
                    modeLabel = '☀️ 浅色';
                  } else if (mode === 'dark') {
                    modeLabel = '🌙 深色';
                  } else {
                    modeLabel = '🔄 跟随系统';
                  }
                  
                  return (
                    <TouchableOpacity
                      key={mode}
                      onPress={() => handleThemeChange(mode)}
                      className={`flex-1 py-3 rounded-lg active:opacity-80 ${
                        isSelected
                          ? 'bg-primary'
                          : 'bg-background border border-border'
                      }`}
                    >
                      <Text
                        className={`text-center text-sm font-semibold ${
                          isSelected ? 'text-white' : 'text-foreground'
                        }`}
                      >
                        {modeLabel}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {/* 当前主题显示 */}
              <View className="bg-background rounded-lg p-3 border border-border">
                <Text className="text-muted text-xs mb-1">当前主题</Text>
                <Text className="text-foreground text-sm font-medium">
                  {colorScheme === 'light' ? '☀️ 浅色模式' : '🌙 深色模式'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 关于应用 */}
        <View className="px-4 pt-6">
          <Text className="text-muted text-sm font-medium mb-3 px-2">关于</Text>
          
          <View className="bg-surface rounded-2xl border border-border overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between px-6 py-4">
              <Text className="text-foreground text-base">应用版本</Text>
              <Text className="text-muted text-sm">1.0.0</Text>
            </TouchableOpacity>

            <View className="h-px bg-border mx-6" />

            <TouchableOpacity className="flex-row items-center justify-between px-6 py-4">
              <Text className="text-foreground text-base">使用帮助</Text>
              <Text className="text-muted text-xl">›</Text>
            </TouchableOpacity>

            <View className="h-px bg-border mx-6" />

            <TouchableOpacity className="flex-row items-center justify-between px-6 py-4">
              <Text className="text-foreground text-base">隐私政策</Text>
              <Text className="text-muted text-xl">›</Text>
            </TouchableOpacity>

            <View className="h-px bg-border mx-6" />

            <TouchableOpacity className="flex-row items-center justify-between px-6 py-4">
              <Text className="text-foreground text-base">用户协议</Text>
              <Text className="text-muted text-xl">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 底部信息 */}
        <View className="items-center mt-8 px-6">
          <Text className="text-muted text-xs text-center leading-relaxed">
            码农黄历 v1.0.0{'\n'}
            专为程序员打造的运势指南{'\n'}
            仅供娱乐参考，请理性看待
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
