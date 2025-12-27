# ⚡️ 快速开始 - 5分钟安装到iPhone

## 📝 简化版步骤（适合急着用的人）

### 1️⃣ 安装依赖（首次）
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
```

### 2️⃣ 初始化（首次）
```bash
npm run build
npx cap add ios
```

### 3️⃣ 打开Xcode
```bash
npm run ios:build
```

### 4️⃣ 在Xcode中
1. 点击顶部 **App** > **Signing & Capabilities**
2. **Team** 选择你的Apple ID（首次需要登录）
3. 连接iPhone到Mac
4. 顶部选择你的iPhone
5. 点击 **▶️** 运行

### 5️⃣ 在iPhone上
1. 设置 > 通用 > VPN与设备管理
2. 信任开发者
3. 打开"人生地图"App ✨

---

## 🔄 以后更新代码

```bash
npm run ios:build
```

然后在Xcode中点击 ▶️

---

**详细步骤请看 IOS-BUILD-GUIDE.md** 📖
