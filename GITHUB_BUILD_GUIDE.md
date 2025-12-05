# 🌟 GitHub + Expo 在线构建APK详细指南

## 📋 准备工作

### 第一步：注册GitHub账号 (如果没有)
1. **访问**：https://github.com
2. **点击"Sign up"** → 填写用户名、邮箱、密码
3. **验证邮箱** → 完成注册

---

## 🗂️ 第二步：创建GitHub仓库

### 1. 登录GitHub
- 输入你的用户名和密码登录

### 2. 创建新仓库
1. **点击右上角"+"** → 选择"New repository"
2. **填写仓库信息**：
   ```
   Repository name: luya-fishing-game
   Description: 路亚钓鱼大师手机游戏
   选择 Public (公开)
   不要勾选"Add a README file" (我们已经有了)
   ```
3. **点击"Create repository"**

---

## 📤 第三步：上传项目文件

### 方法1：网页上传 (推荐给新手)

1. **进入刚创建的仓库页面**
2. **点击"uploading an existing file"** 
3. **拖拽或选择以下文件**：

#### **必须上传的文件**：
```
✅ app.json
✅ package.json  
✅ babel.config.js
✅ eas.json
✅ src/ 文件夹 (整个文件夹)
✅ assets/ 文件夹 (如果有的话)
```

4. **填写提交信息**：
   ```
   Title: "Add luya fishing game initial version"
   Description: "路亚钓鱼大师游戏源码"
   ```
5. **点击"Commit changes"**

### 方法2：使用Git命令 (推荐给有经验的用户)

如果你会使用Git，可以运行：
```bash
cd "/Users/xiaomingzeng/路亚不龟路/路亚钓鱼大师游戏—1764923535495/路亚钓鱼大师游戏—1764923896756"

# 初始化Git仓库
git init
git add .
git commit -m "Initial commit"

# 添加远程仓库 (替换YOUR_USERNAME为你的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/luya-fishing-game.git
git branch -M main
git push -u origin main
```

---

## 🌐 第四步：使用Expo构建APK

### 1. 访问Expo
- 打开：https://expo.dev

### 2. 登录Expo
1. **点击"Sign in with GitHub"**
2. **授权GitHub账号** → 选择你的仓库
3. **完成登录**

### 3. 创建新项目
1. **点击"Create a New Project"**
2. **选择"Import from GitHub"**
3. **选择你的 `luya-fishing-game` 仓库**
4. **点击"Import project"**

### 4. 构建APK
1. **进入项目页面** → 点击"Build"标签
2. **选择构建选项**：
   ```
   Platform: Android
   Build profile: Preview
   ```
3. **点击"Start build"**
4. **等待构建完成** (通常需要5-10分钟)

---

## 📱 第五步：下载APK

### 1. 下载构建完成的APK
- 构建完成后，点击"Download"按钮
- 下载 `app.apk` 文件到电脑

### 2. 传输到手机
**方法A：USB数据线**
```
1. USB连接手机和电脑
2. 开启"文件传输"模式
3. 将APK复制到手机Downloads文件夹
```

**方法B：云传输**
```
1. 上传APK到网盘 (百度网盘、阿里云盘等)
2. 手机登录网盘下载
```

---

## ⚙️ 第六步：手机安装

### 1. 开启安装权限
```
设置 → 安全与隐私 → 更多安全设置 → 安装未知应用
选择"浏览器" → 开启权限
```

### 2. 安装APK
1. **在手机文件管理器中找到APK**
2. **点击安装**
3. **确认权限**
4. **等待安装完成**
5. **桌面出现游戏图标**

---

## 🎮 第七步：开始游戏！

点击桌面"路亚钓鱼大师"图标，开始你的钓鱼之旅！

---

## 🆘 常见问题解决

### Q1: GitHub上传失败？
**A:** 检查文件大小，单个文件不要超过25MB。如果src文件夹太大，可以先上传主要文件，后续补充。

### Q2: Expo构建失败？
**A:** 检查app.json和package.json格式是否正确。或者联系我们帮你检查配置。

### Q3: 手机安装失败？
**A:** 
- 检查是否开启了"安装未知应用"权限
- 确保手机有足够存储空间
- 尝试重新下载APK

### Q4: 游戏无法运行？
**A:** 
- 检查手机系统版本 (Android 7.0+)
- 尝试卸载重新安装
- 联系我们技术支持

---

## 🎯 进阶选项

### 获取永久二维码
如果你想要一个永久可用的二维码让别人也能下载：
1. **构建完成后** → 点击"Share"
2. **生成二维码** → 保存图片
3. **任何人扫码都能下载APK**

### 发布到应用商店
如果想发布到Google Play：
1. **注册Google Play开发者账号** ($25)
2. **使用.keystore文件签名APK**
3. **上传到Google Play Console**

---

## 📞 需要帮助？

在操作过程中遇到任何问题：
1. **截图告诉我问题**
2. **具体说明在哪一步卡住了**
3. **我来帮你解决**

**现在就开始第一步：注册GitHub账号吧！** 🚀

---

## ✅ 检查清单

在开始前，确认你有：
- [ ] 稳定的网络连接
- [ ] 一个邮箱地址 (用于注册)
- [ ] 一部Android手机
- [ ] USB数据线或网盘账号

准备好就开始吧！ 🎣