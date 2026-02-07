# 码农黄历 - 程序员皇历助手

> 一款结合中国传统皇历、每日运势和实时天气的移动应用，为上班族（特别是程序员）提供个性化的每日指导。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android%20%7C%20Web-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

## 📱 应用概述

**码农黄历**是一款专为程序员和上班族打造的运势指南应用。它巧妙地结合了中国传统皇历文化与现代科技，每天为用户提供：

- **今日运势**：综合五星评分、宜忌事项、财运、事业运、健康运、感情运等多维度运势分析
- **实时天气**：集成真实天气API，提供温度、湿度、风速、空气质量等详细信息
- **穿搭建议**：根据天气和运势智能推荐穿搭风格和幸运颜色
- **工作位置建议**：推荐最佳工作位置、工作时段和工作方式
- **程序员特色功能**：包括幸运编程语言、适合的代码类型、Bug出现概率预测、是否适合上线部署等

应用采用简洁优雅的设计风格，遵循Apple Human Interface Guidelines，提供流畅的用户体验。

## 🎯 核心特性

### 运势系统

应用基于日期的数学算法生成确定性的运势数据，确保同一日期的用户获得相同的运势预测。运势系统包含：

| 功能 | 描述 |
|------|------|
| **农历转换** | 显示公历和农历日期、天干地支、生肖等信息 |
| **宜忌事项** | 基于日期生成当日适合和不适合做的事项 |
| **五星评分** | 1-5星综合运势评分 |
| **时辰吉凶** | 12个时辰的吉凶预测 |
| **四大运势** | 事业运、财运、健康运、感情运详细分析 |

### 天气系统

应用集成wttr.in免费天气API，提供实时准确的天气信息：

- 当前温度、最高/最低气温
- 湿度、风速、紫外线指数
- 空气质量指数（AQI）
- 智能穿搭建议
- 自动故障转移（API失败时使用本地模拟数据）

### 程序员特色功能

针对开发者的专属功能，使运势预测更贴近技术工作场景：

| 功能 | 说明 |
|------|------|
| **幸运编程语言** | 每日推荐使用的编程语言（Python、JavaScript、Java等） |
| **代码类型推荐** | 适合的开发任务（前端、后端、算法、重构等） |
| **Bug概率预测** | 今日代码Bug出现的概率（10-40%） |
| **工作建议** | 是否适合开会、Code Review、上线部署等 |
| **工作位置推荐** | 靠窗、角落、开放区等位置建议 |
| **最佳工作时段** | 推荐的工作时间段 |

### 用户体验

- **下拉刷新**：随时更新运势和天气数据
- **深色模式**：自动适配系统主题，保护眼睛
- **历史查询**：日历视图查看任意日期的运势
- **本地存储**：离线保存用户设置和历史数据
- **通知提醒**：可配置的每日运势提醒
- **流畅动画**：优雅的界面交互和过渡效果

## 🏗️ 应用架构

### 屏幕结构

应用采用Tab Bar导航，包含三个主要屏幕：

```
┌─────────────────────────────────┐
│     码农黄历 - 今日运势         │
├─────────────────────────────────┤
│  日期 | 农历 | 运势评分         │
│  ─────────────────────────────  │
│  宜忌事项                       │
│  ─────────────────────────────  │
│  天气信息卡片                   │
│  ─────────────────────────────  │
│  穿搭建议卡片                   │
│  ─────────────────────────────  │
│  工作位置建议卡片               │
│  ─────────────────────────────  │
│  程序员特色建议卡片             │
├─────────────────────────────────┤
│ 🏠 今日 | 📅 历史 | ⚙️ 设置    │
└─────────────────────────────────┘
```

### 数据流

```
用户交互
   ↓
组件状态管理 (useState/useReducer)
   ↓
数据生成/API调用
   ├─ 皇历数据生成 (huangli-data.ts)
   ├─ 天气API调用 (weather-api.ts)
   └─ 本地存储 (AsyncStorage)
   ↓
UI渲染 (NativeWind/Tailwind CSS)
```

## 📦 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **React Native** | 0.81 | 跨平台移动开发 |
| **Expo** | 54 | 开发框架和工具链 |
| **Expo Router** | 6 | 路由和导航 |
| **TypeScript** | 5.9 | 类型安全 |
| **NativeWind** | 4 | Tailwind CSS支持 |
| **React 19** | 最新 | UI框架 |
| **AsyncStorage** | 2.2 | 本地数据存储 |
| **Vitest** | 2.1 | 单元测试 |

## 🚀 快速开始

### 系统要求

- **Node.js**: 18.x 或更高版本
- **pnpm**: 9.12.0 或更高版本
- **iOS**: 13.0 或更高版本（iOS开发）
- **Android**: API 21 或更高版本（Android开发）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd coder-huangli-app
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

4. **在移动设备上测试**
   - 使用Expo Go应用扫描终端显示的二维码
   - 或在浏览器中访问Web预览

### 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（同时启动Metro和API服务器） |
| `pnpm dev:metro` | 仅启动Metro打包器 |
| `pnpm dev:server` | 仅启动API服务器 |
| `pnpm test` | 运行单元测试 |
| `pnpm lint` | 代码检查 |
| `pnpm format` | 代码格式化 |
| `pnpm check` | TypeScript类型检查 |
| `pnpm ios` | 在iOS模拟器中运行 |
| `pnpm android` | 在Android模拟器中运行 |

## 📁 项目结构

```
coder-huangli-app/
├── app/                          # 应用主程序
│   ├── _layout.tsx              # 根布局和提供者
│   ├── fortune-detail.tsx        # 详细运势页面
│   └── (tabs)/                  # Tab Bar导航
│       ├── _layout.tsx          # Tab配置
│       ├── index.tsx            # 今日运势首屏
│       ├── history.tsx          # 历史记录页面
│       └── settings.tsx         # 设置页面
├── components/                   # 可复用组件
│   ├── screen-container.tsx     # SafeArea容器
│   ├── themed-view.tsx          # 主题化视图
│   └── ui/
│       └── icon-symbol.tsx      # 图标映射
├── lib/                         # 业务逻辑和工具
│   ├── huangli-data.ts          # 皇历数据生成
│   ├── weather-data.ts          # 天气数据模拟
│   ├── weather-api.ts           # 天气API调用
│   ├── utils.ts                 # 工具函数
│   ├── theme-provider.tsx       # 主题提供者
│   └── __tests__/               # 单元测试
│       ├── huangli-data.test.ts
│       └── weather-api.test.ts
├── hooks/                        # 自定义Hooks
│   ├── use-colors.ts            # 主题颜色Hook
│   ├── use-color-scheme.ts      # 深色模式检测
│   └── use-auth.ts              # 认证Hook
├── constants/                    # 常量定义
│   └── theme.ts                 # 主题常量
├── assets/                       # 静态资源
│   └── images/                  # 图标和图片
├── design.md                     # 应用设计文档
├── README.md                     # 本文件
├── QUICKSTART.md                 # 开发快速指南
├── app.config.ts                 # Expo配置
├── tailwind.config.js            # Tailwind配置
├── theme.config.js               # 主题配置
├── tsconfig.json                 # TypeScript配置
└── package.json                  # 项目依赖

server/                           # 后端服务（可选）
├── _core/
│   └── index.ts                 # 服务器入口
└── README.md                     # 服务器文档
```

## 🎨 设计理念

### 颜色方案

应用采用紫色系主色调，传达神秘、智慧和科技感：

- **主色调**：紫色 (#7C3AED) - 用于按钮、链接、强调元素
- **辅助色**：橙色 (#F59E0B) - 用于警告、提示、重要信息
- **背景**：白色 (#FFFFFF) 浅色模式 / 深灰 (#151718) 深色模式
- **文本**：深灰 (#11181C) 浅色模式 / 浅灰 (#ECEDEE) 深色模式

### 布局原则

- **移动优先**：竖屏单手操作，9:16比例设计
- **信息分层**：卡片式布局，清晰的视觉层次
- **iOS原生感**：遵循Apple Human Interface Guidelines
- **响应式设计**：适配各种屏幕尺寸

## 🧪 测试

项目包含完整的单元测试覆盖：

```bash
# 运行所有测试
pnpm test

# 监听模式运行测试
pnpm test --watch

# 生成覆盖率报告
pnpm test --coverage
```

### 测试覆盖

- **皇历数据生成** (`lib/__tests__/huangli-data.test.ts`)
  - 数据结构验证
  - 运势评分范围检查
  - 程序员特色数据验证
  - 确定性数据生成

- **天气API** (`lib/__tests__/weather-api.test.ts`)
  - API响应解析
  - 错误处理和降级
  - 数据完整性验证

## 🔧 配置

### 主题配置 (`theme.config.js`)

修改应用的配色方案：

```javascript
const themeColors = {
  primary: { light: '#7C3AED', dark: '#8B5CF6' },
  background: { light: '#ffffff', dark: '#151718' },
  // ... 其他颜色
};
```

### 应用配置 (`app.config.ts`)

更新应用名称、版本、图标等：

```typescript
const env = {
  appName: "码农黄历",
  appSlug: "coder-huangli-app",
  logoUrl: "https://...",
};
```

## 📚 API文档

### 皇历数据生成

```typescript
import { generateHuangliData, generateDetailedFortune } from '@/lib/huangli-data';

// 生成今日运势
const huangliData = generateHuangliData();

// 生成详细运势
const detailedFortune = generateDetailedFortune();
```

### 天气API

```typescript
import { fetchWeatherData } from '@/lib/weather-api';

// 获取天气数据
const weatherData = await fetchWeatherData('Beijing');
```

## 🐛 故障排除

### 天气API请求失败

如果天气API无法连接，应用会自动使用本地模拟数据。检查：

- 网络连接是否正常
- 是否被防火墙阻止
- wttr.in服务是否可用

### 样式显示异常

如果Tailwind样式未正确应用：

```bash
# 重新生成Tailwind配置
pnpm tailwindcss -i ./global.css -o ./dist/output.css

# 清除缓存并重启开发服务器
rm -rf node_modules/.cache
pnpm dev
```

### 类型错误

运行TypeScript检查：

```bash
pnpm check
```

## 📝 许可证

本项目采用MIT许可证。详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交Issue
- 发送邮件至项目维护者

---

**祝您使用愉快！** 🎉

*码农黄历 - 让运势指引您的代码人生*
