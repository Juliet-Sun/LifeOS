# 📱 人生地图 Life OS

> 极简主义日记应用 - 帮助你看见生活正在如何展开

![iOS App](https://img.shields.io/badge/platform-iOS-lightgrey)
![React](https://img.shields.io/badge/react-18.3-blue)
![Capacitor](https://img.shields.io/badge/capacitor-6.0-blue)

---

## ✨ 特性

- 📝 **极简写作** - 专注于记录，没有干扰
- 🎯 **八维度映射** - AI自动分类到八个生命维度
- 🌸 **雪花可视化** - 分形结构展示生活全景
- 🔒 **完全私密** - 数据本地存储，永不上传
- 📱 **原生体验** - 真正的iOS App，流畅自然
- 🎨 **iOS风格** - 参考flomo和notion的优雅设计

---

## 🎯 八个生命维度

1. 💼 职业发展
2. 💰 财务状况  
3. 🏃 个人健康
4. 🎮 娱乐休闲
5. 👨‍👩‍👧 家庭
6. 👥 朋友
7. 📚 个人成长
8. ⭐ 自我实现

---

## 🚀 快速开始

### 📲 安装到iPhone（5分钟）

```bash
# 1. 安装依赖
npm install @capacitor/core @capacitor/cli @capacitor/ios

# 2. 构建并添加iOS平台
npm run build
npx cap add ios

# 3. 打开Xcode
npm run ios:build

# 4. 在Xcode中点击▶️运行
# 5. 在iPhone上信任开发者证书
```

**详细步骤：** 查看 [QUICK-START.md](./QUICK-START.md) 或 [IOS-BUILD-GUIDE.md](./IOS-BUILD-GUIDE.md)

---

## 📖 文档

| 文档 | 说明 |
|------|------|
| [QUICK-START.md](./QUICK-START.md) | ⚡️ 5分钟快速安装指南 |
| [IOS-BUILD-GUIDE.md](./IOS-BUILD-GUIDE.md) | 📱 完整的iOS打包教程 |
| [PWA-SETUP.md](./PWA-SETUP.md) | 🌐 PWA网页版安装（备选方案） |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | 🔧 常见问题解决方案 |

---

## 🛠️ 技术栈

- **前端框架：** React 18.3 + TypeScript
- **样式：** Tailwind CSS 4.0
- **原生打包：** Capacitor 6.0
- **构建工具：** Vite 6.0
- **UI风格：** iOS原生风格
- **数据存储：** localStorage（完全本地）

---

## 📂 项目结构

```
life-os/
├── src/                    # React源代码
│   └── main.tsx           # 应用入口
├── components/            # React组件
│   ├── Home.tsx          # 主页面（记录）
│   ├── History.tsx       # 历史回顾
│   ├── Tree.tsx          # 全景可视化
│   ├── WeeklyReview.tsx  # 周回顾
│   └── Settings.tsx      # 设置
├── public/               # 静态资源
│   ├── icon.svg         # App图标
│   ├── manifest.json    # PWA配置
│   └── sw.js            # Service Worker
├── ios/                  # iOS原生项目（构建后生成）
├── dist/                 # 构建输出
├── capacitor.config.ts   # Capacitor配置
└── package.json
```

---

## 🔄 开发流程

### 本地开发
```bash
npm run dev
```

### 构建Web版本
```bash
npm run build
```

### 更新iOS App
```bash
npm run ios:build
# 然后在Xcode中运行
```

---

## 📱 两种使用方式

### 方式1️⃣：原生iOS App（推荐）
- ✅ 最流畅的性能
- ✅ 完整的原生体验
- ✅ 无需浏览器
- ⚠️ 需要Mac和Xcode

**查看：** [IOS-BUILD-GUIDE.md](./IOS-BUILD-GUIDE.md)

### 方式2️⃣：PWA网页版（无需Mac）
- ✅ 无需Xcode
- ✅ 全屏模式（无地址栏）
- ✅ 添加到主屏幕
- ⚠️ 性能略低于原生

**查看：** [PWA-SETUP.md](./PWA-SETUP.md)

---

## 🎨 设计理念

### 产品定位："镜子"而非"教练"

> "我们帮助用户看见生活正在如何展开，而不是推动用户变得更好。"

- 🪞 **观察，不评判** - 客观记录和展示
- 🌊 **流动，不固化** - 接纳生活的自然节奏
- 🌈 **多元，不单一** - 尊重八个维度的平衡

### 设计风格

- **极简主义** - 减少干扰，专注本质
- **优雅蓝色调** - 平静、理性、包容
- **iOS原生风格** - 熟悉、直观、流畅

---

## 🔒 隐私和安全

- ✅ **完全本地存储** - 所有数据保存在你的设备上
- ✅ **零网络请求** - 不上传任何个人信息
- ✅ **无需账号** - 无需注册或登录
- ✅ **无第三方追踪** - 没有任何分析或广告SDK

**注意：** 如果卸载App或清除浏览器数据，本地数据会丢失。建议定期备份。

---

## ⚙️ 系统要求

### iOS App
- Mac电脑（运行Xcode）
- macOS 12.0+
- Xcode 14.0+
- iPhone iOS 13.0+
- 免费Apple ID（不需要付费开发者账号）

### PWA网页版
- iPhone iOS 13.0+
- Safari浏览器

---

## 🐛 问题反馈

遇到问题？

1. 先查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. 检查是否是已知问题
3. 提交Issue（如果适用）

---

## 📄 许可证

MIT License - 自由使用，商业友好

---

## 🙏 致谢

- **设计灵感：** flomo, Notion
- **技术支持：** React, Capacitor, Tailwind CSS
- **图标设计：** 生命之树（雪花分形）

---

## 🌟 下一步

安装完成后，你可以：

- 📝 开始记录你的第一天
- 🎯 看AI如何分类到八个维度
- 🌸 在"全景"页面看到生命的雪花图
- 📊 每周查看"周回顾"了解生活节奏

**享受记录生活的旅程！** ✨

---

<p align="center">
  Made with ❤️ for thoughtful living
</p>
