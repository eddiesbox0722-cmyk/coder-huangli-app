# 码农黄历 - 部署方案

本文档详细说明了如何将**码农黄历**应用部署到iOS App Store、Google Play Store和Web平台。

## 📋 目录

1. [部署前准备](#部署前准备)
2. [iOS部署](#ios部署)
3. [Android部署](#android部署)
4. [Web部署](#web部署)
5. [持续集成/持续部署(CI/CD)](#持续集成持续部署cicd)
6. [版本管理](#版本管理)
7. [监控和维护](#监控和维护)
8. [故障排除](#故障排除)

## 🔧 部署前准备

### 1. 环境检查

在开始部署前，确保以下工具已安装：

```bash
# 检查Node.js版本
node --version  # 需要18.x或更高

# 检查pnpm版本
pnpm --version  # 需要9.12.0或更高

# 检查Expo CLI
npm list -g expo-cli

# 检查EAS CLI（用于Expo构建）
npm list -g eas-cli
```

### 2. 账户和凭证准备

| 平台 | 需要的账户 | 用途 |
|------|----------|------|
| **iOS** | Apple Developer Account | App Store上架、证书管理 |
| **Android** | Google Play Console | Google Play上架 |
| **Web** | 云服务账户(AWS/Vercel等) | Web应用托管 |
| **Expo** | Expo账户 | 使用EAS构建服务 |

### 3. 应用配置检查

```bash
# 检查app.config.ts中的配置
cat app.config.ts | grep -E "appName|version|bundleIdentifier|package"

# 确保以下信息已更新：
# - appName: 应用显示名称
# - version: 版本号（遵循语义化版本 x.y.z）
# - bundleIdentifier (iOS): com.example.app
# - package (Android): com.example.app
```

### 4. 代码质量检查

```bash
# 运行所有检查
pnpm check          # TypeScript类型检查
pnpm lint           # 代码检查
pnpm test           # 单元测试
pnpm format         # 代码格式化
```

## 🍎 iOS部署

### 第一步：准备iOS构建

#### 1.1 配置Apple Developer账户

1. 访问 [Apple Developer Program](https://developer.apple.com/programs/)
2. 注册或登录账户
3. 创建App ID（Bundle Identifier）
4. 配置签名证书和配置文件

#### 1.2 更新app.config.ts

```typescript
// app.config.ts
const env = {
  appName: "码农黄历",
  appSlug: "coder-huangli-app",
  iosBundleId: "com.yourcompany.coderhuangli",  // 更新为您的Bundle ID
  version: "1.0.0",
};

const config: ExpoConfig = {
  ios: {
    bundleIdentifier: env.iosBundleId,
    supportsTablet: true,
    buildNumber: "1",  // 每次构建递增
  },
};
```

#### 1.3 安装EAS CLI

```bash
npm install -g eas-cli
eas login  # 使用Expo账户登录
```

### 第二步：构建iOS应用

#### 方案A：使用EAS构建（推荐）

```bash
# 初始化EAS配置
eas build:configure

# 构建iOS应用（选择构建类型）
eas build --platform ios --auto-submit

# 构建选项说明：
# --auto-submit: 自动提交到App Store
# --wait: 等待构建完成
# --clear-cache: 清除构建缓存
```

#### 方案B：本地构建

```bash
# 1. 安装依赖
pnpm install

# 2. 生成iOS项目
eas build:configure

# 3. 使用Xcode构建
# 打开ios/coderhuangli.xcworkspace
# 选择Product > Archive
# 使用Organizer上传到App Store
```

### 第三步：提交到App Store

#### 3.1 使用Transporter

```bash
# 下载Transporter应用
# 或使用命令行工具
xcrun altool --upload-app -f "app.ipa" \
  -t ios \
  -u "your-apple-id@example.com" \
  -p "your-app-specific-password"
```

#### 3.2 App Store Connect配置

1. 访问 [App Store Connect](https://appstoreconnect.apple.com/)
2. 创建新应用
3. 填写应用信息：
   - 应用名称
   - 主类别和副类别
   - 内容分级问卷
   - 隐私政策链接
4. 上传应用图标和截图
5. 配置定价和可用性
6. 提交审核

#### 3.3 审核指南

Apple审核通常需要1-3天。注意以下要点：

- **功能完整性**：所有声称的功能必须正常工作
- **隐私政策**：必须有明确的隐私政策
- **内容分级**：准确填写内容分级问卷
- **性能**：应用不能崩溃或冻结
- **UI/UX**：遵循Apple Human Interface Guidelines

## 🤖 Android部署

### 第一步：准备Android构建

#### 1.1 配置Google Play账户

1. 访问 [Google Play Console](https://play.google.com/console)
2. 创建开发者账户（一次性费用$25）
3. 创建新应用
4. 配置应用信息

#### 1.2 生成签名密钥

```bash
# 生成密钥库文件
keytool -genkey -v -keystore my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias

# 保存密钥库文件和密码（重要！）
# 将文件放在安全的地方
```

#### 1.3 更新app.config.ts

```typescript
// app.config.ts
const env = {
  appName: "码农黄历",
  appSlug: "coder-huangli-app",
  androidPackage: "com.yourcompany.coderhuangli",  // 更新为您的包名
  version: "1.0.0",
  versionCode: 1,  // 每次发布递增
};

const config: ExpoConfig = {
  android: {
    package: env.androidPackage,
    versionCode: env.versionCode,
  },
};
```

### 第二步：构建Android应用

#### 方案A：使用EAS构建（推荐）

```bash
# 配置EAS用于Android
eas build:configure

# 构建APK（用于测试）
eas build --platform android --type apk

# 构建AAB（用于Google Play）
eas build --platform android --type app-bundle

# 上传到Google Play
eas submit --platform android
```

#### 方案B：本地构建

```bash
# 1. 安装依赖
pnpm install

# 2. 生成Android项目
eas build:configure

# 3. 构建APK
cd android
./gradlew assembleRelease

# 4. 构建AAB
./gradlew bundleRelease
```

### 第三步：提交到Google Play

#### 3.1 使用EAS提交

```bash
# 自动提交到Google Play
eas submit --platform android \
  --path build-*.aab \
  --key-store-path my-release-key.jks \
  --key-store-alias my-key-alias
```

#### 3.2 手动提交

1. 访问 [Google Play Console](https://play.google.com/console)
2. 选择应用
3. 点击"发布" > "新版本"
4. 上传AAB文件
5. 填写发布说明
6. 配置定价和分发

#### 3.3 Google Play审核指南

Google Play审核通常需要2-4小时。注意以下要点：

- **隐私政策**：必须有隐私政策URL
- **内容分级**：完成内容分级问卷
- **权限合理性**：所有权限必须有明确用途
- **广告**：如果使用广告，必须遵守政策
- **性能**：应用必须在各种设备上正常运行

## 🌐 Web部署

### 第一步：构建Web应用

```bash
# 构建Web版本
pnpm build

# 输出文件在dist/目录中
ls -la dist/
```

### 第二步：选择托管平台

#### 方案A：Vercel（推荐）

```bash
# 1. 安装Vercel CLI
npm install -g vercel

# 2. 部署应用
vercel --prod

# 3. 配置自定义域名
# 在Vercel仪表板中配置
```

#### 方案B：Netlify

```bash
# 1. 安装Netlify CLI
npm install -g netlify-cli

# 2. 部署应用
netlify deploy --prod --dir=dist

# 3. 配置自定义域名
# 在Netlify仪表板中配置
```

#### 方案C：AWS S3 + CloudFront

```bash
# 1. 创建S3桶
aws s3 mb s3://coder-huangli-app

# 2. 上传文件
aws s3 sync dist/ s3://coder-huangli-app --delete

# 3. 配置CloudFront分发
# 在AWS控制台中配置

# 4. 配置自定义域名
# 使用Route 53配置DNS
```

#### 方案D：Docker + 任何云平台

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
```

```bash
# 构建Docker镜像
docker build -t coder-huangli-app:1.0.0 .

# 推送到Docker Hub
docker tag coder-huangli-app:1.0.0 yourusername/coder-huangli-app:1.0.0
docker push yourusername/coder-huangli-app:1.0.0

# 在任何支持Docker的平台上运行
# 例如：Heroku、Railway、Render等
```

### 第三步：配置环境变量

```bash
# 创建.env.production文件
cat > .env.production << EOF
VITE_API_URL=https://api.example.com
VITE_APP_NAME=码农黄历
VITE_APP_LOGO=https://cdn.example.com/logo.png
EOF
```

## 🔄 持续集成/持续部署(CI/CD)

### GitHub Actions配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 9.12.0
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm check
      - run: pnpm lint
      - run: pnpm test

  build-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  build-ios:
    needs: test
    runs-on: macos-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: npm install -g eas-cli
      
      - name: Build iOS with EAS
        run: eas build --platform ios --auto-submit
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}

  build-android:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: npm install -g eas-cli
      
      - name: Build Android with EAS
        run: eas build --platform android --type app-bundle
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

### 配置GitHub Secrets

在GitHub仓库设置中添加以下secrets：

| Secret | 说明 |
|--------|------|
| `EXPO_TOKEN` | Expo账户令牌 |
| `VERCEL_TOKEN` | Vercel部署令牌 |
| `VERCEL_ORG_ID` | Vercel组织ID |
| `VERCEL_PROJECT_ID` | Vercel项目ID |
| `APPLE_ID` | Apple ID（用于iOS签名） |
| `APPLE_PASSWORD` | Apple应用专用密码 |
| `GOOGLE_PLAY_KEY` | Google Play服务账户密钥 |

## 📦 版本管理

### 语义化版本

遵循 [Semantic Versioning](https://semver.org/)：

- **主版本号(MAJOR)**：不兼容的API变更
- **次版本号(MINOR)**：向后兼容的功能新增
- **修订号(PATCH)**：向后兼容的bug修复

### 版本更新流程

```bash
# 1. 更新版本号
# 编辑 app.config.ts 中的 version 字段
# 例如：从 1.0.0 更新到 1.1.0

# 2. 更新CHANGELOG
cat >> CHANGELOG.md << EOF

## [1.1.0] - 2024-02-08

### Added
- 新功能说明

### Fixed
- Bug修复说明

### Changed
- 改进说明
EOF

# 3. 提交和标签
git add .
git commit -m "chore: bump version to 1.1.0"
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin main --tags
```

### 发布清单

部署前检查清单：

- [ ] 所有测试通过
- [ ] 代码审查完成
- [ ] 版本号已更新
- [ ] CHANGELOG已更新
- [ ] 应用图标和截图已准备
- [ ] 隐私政策已更新
- [ ] 应用描述已准备
- [ ] 所有依赖已更新
- [ ] 性能已优化
- [ ] 安全检查已完成

## 📊 监控和维护

### 应用性能监控

```typescript
// 添加性能监控
import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project-id",
  enableInExpoDevelopment: true,
  tracesSampleRate: 1.0,
});
```

### 错误追踪

```typescript
// 捕获错误
try {
  // 代码
} catch (error) {
  Sentry.captureException(error);
}
```

### 用户反馈

- 在应用中添加反馈表单
- 监控应用商店评论
- 定期检查崩溃报告

### 更新策略

| 更新类型 | 频率 | 说明 |
|---------|------|------|
| **安全补丁** | 立即 | 安全漏洞修复 |
| **Bug修复** | 每周 | 关键bug修复 |
| **功能更新** | 每月 | 新功能和改进 |
| **主版本** | 按需 | 重大功能变更 |

## 🆘 故障排除

### iOS构建失败

**问题**：证书过期或无效

```bash
# 解决方案：更新证书
eas build:configure --force
eas build --platform ios --clear-cache
```

### Android构建失败

**问题**：签名密钥不匹配

```bash
# 解决方案：重新生成密钥
keytool -genkey -v -keystore my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

### Web部署失败

**问题**：构建输出过大

```bash
# 解决方案：优化构建
pnpm build --minify
# 检查bundle大小
npm install -g webpack-bundle-analyzer
```

### App Store审核被拒

**常见原因和解决方案**：

| 原因 | 解决方案 |
|------|---------|
| 功能不完整 | 确保所有声称的功能正常工作 |
| 隐私问题 | 添加隐私政策，明确数据使用 |
| 性能问题 | 优化应用性能，减少崩溃 |
| UI问题 | 遵循Apple设计指南 |
| 内容问题 | 检查应用内容是否违反政策 |

## 📚 相关资源

- [Expo部署文档](https://docs.expo.dev/build/introduction/)
- [EAS CLI文档](https://docs.expo.dev/eas/)
- [Apple App Store审核指南](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play政策中心](https://play.google.com/about/developer-content-policy/)
- [Semantic Versioning](https://semver.org/)

## 🎯 部署时间表示例

```
Week 1: 准备和测试
  - 完成所有功能测试
  - 准备应用商店资源
  - 配置部署环境

Week 2: iOS部署
  - 构建iOS应用
  - 提交App Store审核
  - 等待审核结果

Week 3: Android部署
  - 构建Android应用
  - 提交Google Play
  - 等待审核结果

Week 4: Web部署和发布
  - 部署Web版本
  - 宣传和营销
  - 监控和维护
```

---

**祝您部署顺利！** 🚀

如有问题，请参考相关平台的官方文档或提交Issue。
