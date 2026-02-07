# 快速开始指南 - 码农黄历开发

本指南为开发者提供项目的技术栈、架构、开发环境搭建和开发流程说明。

## 📋 目录

1. [技术栈概览](#技术栈概览)
2. [项目架构](#项目架构)
3. [开发环境搭建](#开发环境搭建)
4. [启动开发](#启动开发)
5. [开发工作流](#开发工作流)
6. [常见任务](#常见任务)
7. [调试技巧](#调试技巧)
8. [性能优化](#性能优化)
9. [故障排除](#故障排除)

## 🛠️ 技术栈概览

### 核心框架

| 技术 | 版本 | 用途 | 为什么选择 |
|------|------|------|----------|
| **React Native** | 0.81 | 跨平台移动开发 | 一套代码运行在iOS、Android和Web |
| **Expo** | 54 | 开发框架 | 简化React Native开发，提供丰富的原生API |
| **Expo Router** | 6 | 文件系统路由 | 类似Next.js的路由体验，自动生成导航 |
| **TypeScript** | 5.9 | 类型系统 | 提高代码质量，减少运行时错误 |
| **React 19** | 最新 | UI框架 | 最新特性，更好的性能 |

### 样式和UI

| 技术 | 版本 | 用途 | 为什么选择 |
|------|------|------|----------|
| **NativeWind** | 4 | React Native的Tailwind CSS | 熟悉的Tailwind语法，在移动端也能用 |
| **Tailwind CSS** | 3.4 | 工具类CSS框架 | 快速开发，一致的设计系统 |
| **Expo Symbols** | 1.0 | iOS原生图标 | 原生SF Symbols支持，保证iOS体验 |

### 状态和数据

| 技术 | 版本 | 用途 | 为什么选择 |
|------|------|------|----------|
| **React Hooks** | 内置 | 状态管理 | 轻量级，适合中小型应用 |
| **AsyncStorage** | 2.2 | 本地存储 | 跨平台持久化存储 |
| **TanStack Query** | 5.90 | 服务器状态管理 | 缓存、同步、后台更新 |

### 测试和质量

| 技术 | 版本 | 用途 | 为什么选择 |
|------|------|------|----------|
| **Vitest** | 2.1 | 单元测试 | 快速、兼容Jest、支持TypeScript |
| **ESLint** | 9.39 | 代码检查 | 保证代码质量和一致性 |
| **Prettier** | 3.7 | 代码格式化 | 自动格式化，团队风格统一 |

### 开发工具

| 工具 | 用途 |
|------|------|
| **pnpm** | 包管理器（快速、节省空间） |
| **Metro** | React Native打包器 |
| **Drizzle ORM** | 数据库ORM（可选） |
| **Express** | 后端框架（可选） |

## 🏗️ 项目架构

### 应用结构

```
应用入口 (app/_layout.tsx)
    ↓
主题提供者 (ThemeProvider)
    ↓
Tab Bar导航 (app/(tabs)/_layout.tsx)
    ├─ 今日运势 (app/(tabs)/index.tsx)
    ├─ 历史记录 (app/(tabs)/history.tsx)
    └─ 设置 (app/(tabs)/settings.tsx)
    ↓
详细运势页面 (app/fortune-detail.tsx)
```

### 数据流架构

```
┌─────────────────────────────────────────────────┐
│              用户界面层 (UI)                    │
│  - React组件                                    │
│  - NativeWind样式                              │
│  - 状态管理 (useState/useReducer)              │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│            业务逻辑层 (Logic)                   │
│  - 皇历数据生成 (huangli-data.ts)              │
│  - 天气API调用 (weather-api.ts)                │
│  - 本地存储 (AsyncStorage)                     │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│            数据源层 (Data Source)               │
│  - wttr.in天气API                              │
│  - 本地算法生成的运势数据                      │
│  - 本地存储 (AsyncStorage)                     │
└─────────────────────────────────────────────────┘
```

### 文件组织

**按功能分层**：

```
lib/                    # 业务逻辑
├── huangli-data.ts    # 皇历数据生成
├── weather-api.ts     # 天气API
├── weather-data.ts    # 天气模拟数据
├── utils.ts           # 工具函数
└── __tests__/         # 测试文件

components/            # UI组件
├── screen-container.tsx
├── themed-view.tsx
└── ui/
    └── icon-symbol.tsx

hooks/                 # 自定义Hooks
├── use-colors.ts
├── use-color-scheme.ts
└── use-auth.ts

app/                   # 页面和路由
├── _layout.tsx
├── fortune-detail.tsx
└── (tabs)/
    ├── index.tsx
    ├── history.tsx
    └── settings.tsx
```

## 💻 开发环境搭建

### 前置要求

```bash
# 检查Node.js版本（需要18.x或更高）
node --version

# 检查pnpm版本（需要9.12.0或更高）
pnpm --version
```

### 第一次设置

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd coder-huangli-app
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```
   
   这会安装所有npm包，包括：
   - React Native和Expo
   - 开发工具和测试框架
   - 类型定义

3. **验证安装**
   ```bash
   pnpm check
   ```
   
   运行TypeScript检查确保没有类型错误。

### IDE配置

**推荐使用VS Code**

安装扩展：
- **ES7+ React/Redux/React-Native snippets** - 代码片段
- **Tailwind CSS IntelliSense** - Tailwind自动完成
- **TypeScript Vue Plugin** - TypeScript支持
- **Prettier - Code formatter** - 代码格式化
- **ESLint** - 代码检查

**VS Code设置** (`.vscode/settings.json`):
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 🚀 启动开发

### 启动开发服务器

```bash
# 启动完整开发环境（Metro + API服务器）
pnpm dev
```

这会：
1. 启动Metro打包器（监听代码变化）
2. 启动Express API服务器（端口3000）
3. 显示QR码用于扫描在Expo Go中打开

### 在不同平台上开发

**Web开发**（最快的开发体验）
```bash
pnpm dev
# 打开浏览器访问显示的URL
```

**iOS开发**
```bash
pnpm ios
# 在iOS模拟器中打开应用
```

**Android开发**
```bash
pnpm android
# 在Android模拟器中打开应用
```

**物理设备**
```bash
# 1. 在手机上安装Expo Go应用
# 2. 运行pnpm dev
# 3. 使用Expo Go扫描终端显示的QR码
```

## 📝 开发工作流

### 添加新页面

1. **创建页面文件**
   ```bash
   # 在app目录下创建新的.tsx文件
   touch app/new-page.tsx
   ```

2. **使用ScreenContainer包装**
   ```tsx
   import { ScreenContainer } from "@/components/screen-container";
   
   export default function NewPage() {
     return (
       <ScreenContainer className="p-4">
         {/* 页面内容 */}
       </ScreenContainer>
     );
   }
   ```

3. **在路由中注册**
   - 如果是Tab页面，在 `app/(tabs)/_layout.tsx` 中添加 `<Tabs.Screen>`
   - 如果是普通页面，Expo Router会自动识别

### 修改样式

应用使用NativeWind（Tailwind CSS for React Native）：

```tsx
// ✅ 正确的样式方式
<View className="flex-1 items-center justify-center bg-primary p-4">
  <Text className="text-2xl font-bold text-white">Hello</Text>
</View>

// ❌ 避免使用style prop
// <View style={{ flex: 1, ... }}>
```

### 添加新功能

1. **创建业务逻辑文件** (`lib/new-feature.ts`)
   ```typescript
   export function generateData() {
     // 业务逻辑
   }
   ```

2. **编写测试** (`lib/__tests__/new-feature.test.ts`)
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { generateData } from '../new-feature';
   
   describe('新功能', () => {
     it('应该工作', () => {
       expect(generateData()).toBeDefined();
     });
   });
   ```

3. **在组件中使用**
   ```tsx
   import { generateData } from '@/lib/new-feature';
   
   export default function MyComponent() {
     const data = generateData();
     return <Text>{data}</Text>;
   }
   ```

4. **运行测试验证**
   ```bash
   pnpm test
   ```

### 调整主题

**修改颜色** (`theme.config.js`):
```javascript
const themeColors = {
  primary: { light: '#7C3AED', dark: '#8B5CF6' },
  // 修改其他颜色...
};
```

**修改字体大小** (`tailwind.config.js`):
```javascript
theme: {
  extend: {
    fontSize: {
      'xs': '12px',
      'sm': '14px',
      // ...
    }
  }
}
```

## 🔧 常见任务

### 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式（代码变化时自动重新运行）
pnpm test --watch

# 运行特定测试文件
pnpm test huangli-data

# 生成覆盖率报告
pnpm test --coverage
```

### 代码检查和格式化

```bash
# 检查代码质量
pnpm lint

# 自动修复可修复的问题
pnpm lint --fix

# 格式化代码
pnpm format

# TypeScript类型检查
pnpm check
```

### 构建生产版本

```bash
# 构建后端服务器
pnpm build

# 启动生产服务器
pnpm start
```

### 清理缓存

```bash
# 清理Metro缓存
pnpm dev --reset-cache

# 清理node_modules和重新安装
rm -rf node_modules
pnpm install
```

## 🐛 调试技巧

### 浏览器开发者工具

在Web版本中，可以使用浏览器的开发者工具：

1. 按 `F12` 打开开发者工具
2. 在Console标签中查看日志
3. 在Network标签中查看API请求
4. 使用React DevTools检查组件树

### 日志输出

```typescript
// 基本日志
console.log('信息:', data);
console.warn('警告:', error);
console.error('错误:', error);

// 结构化日志
console.table(data);

// 分组日志
console.group('功能名称');
console.log('详情1');
console.log('详情2');
console.groupEnd();
```

### 调试API请求

```typescript
// 在weather-api.ts中添加日志
console.log('请求URL:', url);
console.log('响应数据:', data);

// 使用Network标签查看请求
// 在浏览器开发者工具中查看所有API请求
```

### 性能监测

```typescript
// 测量函数执行时间
console.time('操作名称');
// ... 执行操作
console.timeEnd('操作名称');

// 输出示例: 操作名称: 123.45ms
```

## ⚡ 性能优化

### 组件优化

```typescript
// 使用React.memo防止不必要的重新渲染
const MemoizedCard = React.memo(({ data }) => {
  return <View>{/* 卡片内容 */}</View>;
});

// 使用useMemo缓存计算结果
const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// 使用useCallback缓存函数
const memoizedCallback = useCallback(() => {
  handleClick();
}, []);
```

### 列表优化

```typescript
// ✅ 使用FlatList（高效）
<FlatList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  keyExtractor={(item) => item.id}
/>

// ❌ 避免使用ScrollView + map（低效）
// <ScrollView>
//   {items.map(item => <Item key={item.id} item={item} />)}
// </ScrollView>
```

### 图片优化

```typescript
// 使用Image组件的width/height属性
<Image
  source={{ uri: 'https://...' }}
  style={{ width: 200, height: 200 }}
/>

// 预加载图片
Image.prefetch('https://...');
```

### 网络请求优化

```typescript
// 使用缓存避免重复请求
const [weatherData, setWeatherData] = useState(null);
const [lastFetchTime, setLastFetchTime] = useState(0);

const fetchWeather = async () => {
  const now = Date.now();
  // 5分钟内不重新请求
  if (now - lastFetchTime < 5 * 60 * 1000) {
    return weatherData;
  }
  
  const data = await fetchWeatherData();
  setWeatherData(data);
  setLastFetchTime(now);
  return data;
};
```

## 🆘 故障排除

### 问题：Metro打包器崩溃

**症状**：开发服务器停止响应

**解决方案**：
```bash
# 清除缓存并重启
pnpm dev --reset-cache

# 或者手动清除
rm -rf node_modules/.cache
pnpm dev
```

### 问题：样式不生效

**症状**：Tailwind类名没有应用样式

**解决方案**：
```bash
# 1. 检查类名是否正确
# 2. 确保文件在tailwind.config.js的content中
# 3. 重启开发服务器
pnpm dev --reset-cache
```

### 问题：类型错误

**症状**：TypeScript报错

**解决方案**：
```bash
# 运行类型检查
pnpm check

# 查看详细错误信息
pnpm check --listFiles
```

### 问题：天气API请求失败

**症状**：天气信息显示默认值

**解决方案**：
```typescript
// 检查网络连接
// 检查API是否可用：https://wttr.in/Beijing?format=j1
// 查看浏览器开发者工具的Network标签

// 临时使用模拟数据进行开发
import { generateWeatherData } from '@/lib/weather-data';
const weatherData = generateWeatherData();
```

### 问题：内存泄漏

**症状**：应用运行变慢

**解决方案**：
```typescript
// 确保清理事件监听器
useEffect(() => {
  const subscription = eventEmitter.subscribe(handleEvent);
  
  return () => {
    subscription.unsubscribe(); // 清理
  };
}, []);

// 确保清理定时器
useEffect(() => {
  const timer = setTimeout(() => {
    // ...
  }, 1000);
  
  return () => clearTimeout(timer); // 清理
}, []);
```

## 📚 学习资源

- [React Native官方文档](https://reactnative.dev/)
- [Expo官方文档](https://docs.expo.dev/)
- [Expo Router文档](https://docs.expo.dev/routing/introduction/)
- [NativeWind文档](https://www.nativewind.dev/)
- [Tailwind CSS文档](https://tailwindcss.com/)
- [TypeScript官方文档](https://www.typescriptlang.org/)

## 🎯 开发最佳实践

1. **始终编写测试**：在添加功能前编写测试
2. **保持组件小巧**：单一职责原则
3. **使用TypeScript**：充分利用类型系统
4. **避免深层嵌套**：保持组件树扁平
5. **使用常量**：避免魔法数字
6. **添加注释**：解释复杂逻辑
7. **定期重构**：保持代码整洁
8. **性能优先**：监测和优化关键路径

## 📞 获取帮助

- 查看项目中的 `design.md` 了解设计决策
- 查看 `README.md` 了解功能概览
- 查看代码中的注释和JSDoc文档
- 运行 `pnpm test` 查看测试用例

---

**祝您开发愉快！** 🚀

如有问题，请参考故障排除部分或提交Issue。
