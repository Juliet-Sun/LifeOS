# 📱 将"人生地图"打包成iOS App完整指南

## 📋 前提条件

- ✅ Mac电脑（必需，因为Xcode只能在Mac上运行）
- ✅ iPhone（用于安装测试）
- ✅ Lightning/USB-C数据线（连接iPhone和Mac）
- ✅ Xcode（从Mac App Store免费下载）
- ❌ **不需要**付费开发者账号（免费即可）

---

## 🚀 步骤1：安装依赖

在项目根目录打开终端，运行：

```bash
# 安装Capacitor相关依赖
npm install @capacitor/core @capacitor/cli @capacitor/ios
```

---

## 🔧 步骤2：构建Web应用

```bash
# 构建生产版本
npm run build
```

这会在 `dist` 文件夹中生成优化后的静态文件。

---

## 📦 步骤3：初始化Capacitor（首次运行）

```bash
# 初始化Capacitor配置
npx cap init
```

**回答问题时：**
- App name: `人生地图`
- App Package ID: `com.lifeos.app`（或者你想要的ID）
- Web asset directory: `dist`（默认，直接回车）

**注意：** 如果之前已经创建了 `capacitor.config.ts`，可能会询问是否覆盖，选择 `No` 保留现有配置。

---

## 📱 步骤4：添加iOS平台

```bash
# 添加iOS平台支持
npx cap add ios
```

这会创建一个 `ios` 文件夹，包含完整的Xcode项目。

---

## 🔄 步骤5：同步代码到iOS项目

```bash
# 同步Web代码到iOS
npx cap sync
```

**每次修改代码后都需要运行：**
```bash
npm run build    # 重新构建
npx cap sync     # 同步到iOS
```

或者使用快捷命令：
```bash
npm run ios:build
```

---

## 🍎 步骤6：在Xcode中打开项目

```bash
# 打开Xcode
npx cap open ios
```

或者手动打开：
```
双击打开 ios/App/App.xcworkspace
```

**⚠️ 重要：** 打开的是 `.xcworkspace` 文件，不是 `.xcodeproj` 文件！

---

## ⚙️ 步骤7：配置Xcode

### 7.1 选择开发团队

1. 在Xcode左侧项目导航中，点击顶部的 **App**（蓝色图标）
2. 选择 **Signing & Capabilities** 标签
3. 在 **Team** 下拉菜单中：
   - 如果已登录Apple ID：选择你的个人团队（Personal Team）
   - 如果未登录：点击 **Add Account**，用你的Apple ID登录

**免费账号限制：**
- ✅ 可以安装到自己的设备
- ✅ App可以运行7天（到期后重新安装即可）
- ❌ 不能分发给其他人
- ❌ 不能上架App Store

### 7.2 修改Bundle Identifier（如果需要）

如果出现"Bundle Identifier不可用"的错误：
1. 修改 **Bundle Identifier** 为唯一值，例如：
   - `com.yourname.lifeos`
   - `com.lifeos.app.yourname`

---

## 📲 步骤8：安装到iPhone

### 8.1 连接iPhone到Mac

1. 用数据线连接iPhone和Mac
2. iPhone上会弹出"信任此电脑"，点击**信任**
3. 输入iPhone密码

### 8.2 选择设备

在Xcode顶部工具栏：
1. 点击设备选择器（左侧显示"App > 设备"）
2. 选择你的iPhone名称

### 8.3 运行App

1. 点击Xcode左上角的 **▶️ 播放按钮**（或按 `Cmd + R`）
2. Xcode会开始构建并安装到iPhone
3. 第一次安装时，iPhone上会提示需要信任开发者证书

### 8.4 信任开发者证书

在iPhone上：
1. 打开 **设置 > 通用 > VPN与设备管理**
2. 找到你的Apple ID开发者证书
3. 点击 **信任**
4. 返回主屏幕，打开"人生地图"App

---

## 🎉 完成！

现在你的iPhone上有一个**真正的原生App**了！

---

## 🔄 后续更新流程

每次修改代码后：

```bash
# 方法1：手动步骤
npm run build      # 1. 构建
npx cap sync       # 2. 同步
npx cap open ios   # 3. 在Xcode中运行

# 方法2：使用快捷命令
npm run ios:build  # 自动构建+同步+打开Xcode
```

然后在Xcode中点击 ▶️ 运行。

---

## 🐛 常见问题

### Q1: "Signing for 'App' requires a development team"
**解决：** 在Xcode中添加你的Apple ID作为开发团队。

### Q2: "Unable to install, app could not be verified"
**解决：** 去iPhone的 设置 > 通用 > VPN与设备管理 信任开发者。

### Q3: App安装后打开是白屏
**解决：** 
```bash
npm run build
npx cap sync
# 然后在Xcode中重新运行
```

### Q4: "The device is locked"
**解决：** 解锁你的iPhone。

### Q5: App过期了（7天后）
**解决：** 在Xcode中重新运行一次即可，会自动续期。

---

## 📂 项目结构

```
your-project/
├── ios/                    # iOS原生项目（Capacitor自动生成）
│   └── App/
│       └── App.xcworkspace # 在Xcode中打开这个
├── dist/                   # 构建输出（Web静态文件）
├── src/                    # React源代码
├── capacitor.config.ts     # Capacitor配置
└── package.json
```

---

## 💡 提示

- **数据存储：** localStorage在iOS App中会自动映射到原生存储
- **调试：** 在Xcode中可以看到Console日志
- **性能：** 原生App比浏览器运行更流畅
- **图标：** App图标会使用 `public/icon.svg`
- **启动画面：** 可以在 `capacitor.config.ts` 中配置

---

## 🎨 自定义App图标和启动画面

### App图标

1. 准备1024x1024的PNG图标
2. 在Xcode中：
   - 左侧导航 > App > Assets
   - 点击 AppIcon
   - 拖入你的图标

### 启动画面（可选）

编辑 `ios/App/App/Assets.xcassets/Splash.imageset/` 中的图片

---

## 📱 下一步

- ✅ 应用已经可以在你的iPhone上使用
- ✅ 数据完全本地存储，私密安全
- ✅ 享受原生App体验！

如果想要发布给朋友或上架App Store，需要加入 [Apple Developer Program](https://developer.apple.com/programs/)（¥688/年）。

---

**享受你的原生日记App吧！** ✨📱
