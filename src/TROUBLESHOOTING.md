# 🔧 故障排除指南

## 🚨 常见问题和解决方案

### 1. 构建相关问题

#### ❌ "Command not found: npx"
**原因：** Node.js没有正确安装

**解决：**
```bash
# 检查Node.js版本
node --version

# 如果没有安装，从 https://nodejs.org 下载安装
```

#### ❌ "Cannot find module '@capacitor/cli'"
**原因：** 依赖没有安装

**解决：**
```bash
npm install
```

#### ❌ npm run build 失败
**原因：** 代码有错误

**解决：**
```bash
# 查看详细错误信息
npm run build

# 检查是否有TypeScript错误
# 修复后重新运行
```

---

### 2. Capacitor相关问题

#### ❌ "npx cap add ios" 失败
**原因：** 可能是路径或权限问题

**解决：**
```bash
# 确保在项目根目录
pwd

# 清理并重试
rm -rf ios/
npx cap add ios
```

#### ❌ "Unable to find capacitor.config"
**原因：** Capacitor没有正确初始化

**解决：**
```bash
# 检查是否存在 capacitor.config.ts
ls capacitor.config.ts

# 如果不存在，项目已经配置好了，应该能看到这个文件
```

#### ❌ "Capacitor sync failed"
**原因：** dist文件夹不存在或为空

**解决：**
```bash
# 先构建
npm run build

# 确认dist文件夹存在
ls dist/

# 然后同步
npx cap sync
```

---

### 3. Xcode相关问题

#### ❌ "Unable to open App.xcworkspace"
**原因：** Xcode没有安装或iOS平台没有添加

**解决：**
1. 确保Xcode已安装：Mac App Store搜索"Xcode"
2. 确保已运行：`npx cap add ios`
3. 打开正确的文件：`ios/App/App.xcworkspace`（不是.xcodeproj）

#### ❌ "Signing for 'App' requires a development team"
**原因：** 没有配置开发团队

**解决：**
1. Xcode > Preferences > Accounts
2. 点击"+"添加Apple ID
3. 返回项目设置
4. Signing & Capabilities > Team > 选择你的账号

#### ❌ "Failed to create provisioning profile"
**原因：** Bundle Identifier已被使用

**解决：**
1. 在Xcode中修改Bundle Identifier
2. 改为唯一值，例如：`com.yourname.lifeos`

#### ❌ "The device is locked"
**原因：** iPhone被锁定了

**解决：**
解锁你的iPhone，然后重新点击 ▶️

---

### 4. iPhone相关问题

#### ❌ "Trust This Computer" 不出现
**原因：** iPhone没有正确识别

**解决：**
1. 拔掉数据线，重新插入
2. 解锁iPhone
3. 如果还是不行，重启iPhone和Mac

#### ❌ App安装后无法打开
**原因：** 开发者证书未信任

**解决：**
iPhone上：设置 > 通用 > VPN与设备管理 > 信任你的开发者证书

#### ❌ App打开后是白屏或黑屏
**原因：** Web资源没有正确同步

**解决：**
```bash
npm run build
npx cap sync
# 然后在Xcode中重新运行
```

#### ❌ "App installation failed" 
**原因：** iPhone存储空间不足或其他原因

**解决：**
1. 检查iPhone存储空间
2. 删除旧版本App（如果存在）
3. 重启iPhone
4. 在Xcode中重新运行

---

### 5. 数据相关问题

#### ❌ 数据丢失了
**原因：** localStorage在App更新时可能被清除

**解决：**
抱歉，localStorage数据在某些情况下可能丢失。建议：
- 定期导出数据（如果应用支持）
- 或者考虑添加iCloud同步功能（需要额外开发）

#### ❌ Web版和App版数据不同步
**原因：** 它们是完全独立的存储

**解决：**
这是正常的。localStorage在不同环境（浏览器 vs App）中是独立的。

---

### 6. 更新相关问题

#### ❌ 修改代码后App没有变化
**原因：** 忘记重新构建和同步

**解决：**
```bash
npm run build
npx cap sync
# 然后在Xcode中重新运行
```

#### ❌ App突然无法打开（7天后）
**原因：** 免费开发者证书过期

**解决：**
在Xcode中重新运行一次即可，会自动续期。

---

### 7. 性能问题

#### ❌ App运行很慢
**原因：** Debug模式或设备性能

**解决：**
1. 确保使用的是 `npm run build`（生产模式）
2. 在Xcode中选择 Product > Scheme > Edit Scheme
3. Run > Build Configuration > Release
4. 重新运行

#### ❌ App占用空间很大
**原因：** 正常，包含了完整的WebView和资源

**解决：**
这是正常的。原生App会比Web版大一些。

---

### 8. 网络相关问题

#### ❌ "Unable to connect to localhost"
**原因：** Capacitor在原生环境运行，不需要本地服务器

**解决：**
确保使用的是构建后的静态文件（dist），不是开发服务器。

---

## 🆘 仍然无法解决？

### 完全重置流程

```bash
# 1. 清理所有构建产物
rm -rf dist/
rm -rf ios/
rm -rf node_modules/

# 2. 重新安装
npm install

# 3. 重新构建
npm run build

# 4. 重新添加iOS平台
npx cap add ios

# 5. 打开Xcode
npx cap open ios
```

### 检查清单

- [ ] Node.js已安装（v16+）
- [ ] Xcode已安装并打开过一次
- [ ] 已运行 `npm install`
- [ ] 已运行 `npm run build`
- [ ] 已运行 `npx cap add ios`
- [ ] iPhone已解锁并连接到Mac
- [ ] 已信任Mac（iPhone上）
- [ ] Xcode中已选择开发团队
- [ ] Xcode中已选择你的iPhone设备

### 获取详细日志

```bash
# 在Xcode中查看Console输出
# Window > Devices and Simulators > 选择你的设备 > Open Console
```

---

## 📚 更多资源

- [Capacitor官方文档](https://capacitorjs.com/docs)
- [Xcode使用指南](https://developer.apple.com/xcode/)
- [Apple Developer Forums](https://developer.apple.com/forums/)

---

**记住：大多数问题都可以通过"清理 > 重新构建 > 重新同步"解决！** 🔄
