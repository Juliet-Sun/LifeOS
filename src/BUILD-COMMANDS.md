# 🚀 正确的构建命令

## 第一次构建（执行一次）

```bash
# 1. 确保已经构建了
npm run build

# 2. 添加iOS平台
npx cap add ios

# 3. 同步代码
npx cap sync
```

## 打开Xcode

```bash
# 方式1：使用npm脚本
npm run cap:open:ios

# 方式2：直接运行
npx cap open ios

# 方式3：手动打开
# 在Finder中打开 ios/App/App.xcworkspace
```

## 以后更新代码

每次修改代码后：

```bash
# 方式1：分步执行
npm run build
npx cap sync
npx cap open ios

# 方式2：一键执行
npm run ios:build
```

## 检查当前状态

```bash
# 查看当前配置
npx cap ls

# 查看已安装的平台
ls -la ios/
```

## 常见问题

### 构建输出在 build/ 还是 dist/?

检查你的项目：
```bash
# 查看构建后的文件夹
ls -la build/
ls -la dist/

# 如果是 build/，那是正确的
# capacitor.config.ts 已经配置为 webDir: 'build'
```

### iOS平台已存在

如果看到"ios platform is already added"：
```bash
# 直接同步即可
npx cap sync
npx cap open ios
```

### 删除iOS平台重来

```bash
rm -rf ios/
npx cap add ios
npx cap sync
```
