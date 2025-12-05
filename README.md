# 路亚钓鱼大师 - 移动端版本

一款专为移动设备设计的路亚钓鱼模拟游戏，采用 React Native + Expo 技术栈开发。

## 🎮 游戏特色

### 核心玩法
- 🎣 **真实钓鱼体验**: 模拟真实的路亚钓鱼操作
- 🐟 **丰富的鱼类**: 包含淡水和海水鱼类，共8种不同稀有度的鱼
- 🌤️ **动态天气系统**: 晴天、雨天、大风、暴风雨影响钓鱼成功率
- ⏰ **时间系统**: 日夜循环、四季变化影响鱼类活动
- 🎯 **技能成长**: 钓鱼、抛竿、收线三项技能等级提升

### 游戏内容
- 🏞️ **多个钓场**: 宁静湖泊、急流河川、深海渔场
- 🎒 **装备系统**: 4种钓竿、4种卷线器、7种拟饵
- 🏆 **成就系统**: 收集成就，获得奖励
- 📋 **任务系统**: 完成任务，赚取金币
- 📚 **鱼类图鉴**: 收集所有鱼类，查看详细信息

## 📱 移动端特性

### UI/UX 设计
- 📱 **纯移动端设计**: 专为手机优化的界面布局
- 🎯 **底部导航**: 首页、钓鱼、图鉴、商店、设置五大模块
- 🎮 **触控优化**: 大尺寸点击区域，支持触控手势
- 🌓 **暗黑模式**: 护眼的深色主题设计
- 📐 **全面屏适配**: 支持各种屏幕比例和刘海屏

### 交互体验
- 🎯 **虚拟摇杆**: 左下角方向控制
- 🎮 **触控按钮**: 右下角大型操作按钮
- 📳 **震动反馈**: 可选的触觉反馈
- 🔊 **音效系统**: 可开关的游戏音效
- 📸 **拍照留念**: 捕获鱼类后的拍照功能

## 🛠️ 技术架构

### 技术栈
- **框架**: React Native 0.73 + Expo 50
- **导航**: React Navigation 6
- **UI库**: 自定义组件 + TailwindCSS样式
- **图标**: Expo Vector Icons
- **手势**: React Native Gesture Handler
- **动画**: React Native Reanimated
- **存储**: AsyncStorage (本地数据存储)

### 项目结构
```
src/
├── components/          # 通用组件
│   ├── ui/             # UI基础组件
│   ├── game/           # 游戏相关组件
│   └── collection/     # 图鉴相关组件
├── screens/            # 页面组件
├── game/               # 游戏逻辑
├── data/               # 游戏数据
├── utils/              # 工具函数
├── hooks/              # 自定义Hook
├── styles/             # 样式文件
└── types/              # TypeScript类型定义
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- Expo CLI >= 3.12.0
- EAS CLI >= 3.0.0

### 安装依赖
```bash
# 克隆项目
git clone <repository-url>
cd lure-fishing-master

# 安装依赖
npm install

# 或者使用构建脚本
./build-scripts.sh install
```

### 开发运行
```bash
# 启动开发服务器
npm start
# 或
./build-scripts.sh dev

# 在手机上运行
# 1. 扫描二维码下载 Expo Go 应用
# 2. 用 Expo Go 扫描项目二维码
```

## 🔨 构建部署

### 快速构建
```bash
# 构建 Android APK (预览版)
./build-scripts.sh build:android

# 构建 iOS 应用 (预览版)
./build-scripts.sh build:ios

# 构建生产版本
./build-scripts.sh build:prod
```

### 手动构建
```bash
# 安装构建依赖
./build-scripts.sh deps

# Android APK 构建
eas build --platform android --profile preview

# iOS 应用构建
eas build --platform ios --profile preview

# 生产版本构建 (AAB用于Google Play)
eas build --platform android --profile production
```

### 构建配置
- `app.json`: 应用基础配置
- `eas.json`: EAS构建配置
- `package.json`: 项目依赖配置

## 📱 平台支持

### Android
- **最低版本**: Android 7.0 (API 24)
- **推荐版本**: Android 10.0 (API 29)+
- **架构**: ARM64, ARMv7
- **文件格式**: APK (测试)、AAB (发布)

### iOS
- **最低版本**: iOS 12.0+
- **推荐版本**: iOS 15.0+
- **设备**: iPhone, iPad
- **文件格式**: IPA

## 🎯 核心功能模块

### 1. 钓鱼系统
- 抛竿机制：力度和角度控制
- 上钩检测：基于鱼类活跃度和拟饵匹配度
- 收线操作：张力控制防止断线
- 成功判定：根据装备和技能计算成功率

### 2. 装备系统
- 钓竿：影响抛竿距离和力量
- 卷线器：影响收线速度和顺滑度
- 拟饵：影响鱼类吸引力
- 耐久度：装备使用损耗

### 3. 经济系统
- 金币：主要货币，购买装备
- 钻石：高级货币，特殊用途
- 收入：钓鱼获得，任务奖励

### 4. 数据存储
- 本地存储：AsyncStorage
- 自动保存：重要操作后自动保存
- 数据导出：支持备份和恢复

## 🎨 界面设计

### 设计原则
- **移动优先**: 专为触摸操作设计
- **视觉层次**: 清晰的信息层级
- **响应式**: 适配各种屏幕尺寸
- **一致性**: 统一的设计语言

### 色彩系统
- **主色调**: 深蓝色 (#0f172a)
- **强调色**: 蓝色 (#3b82f6)
- **成功色**: 绿色 (#22c55e)
- **警告色**: 橙色 (#f59e0b)
- **错误色**: 红色 (#ef4444)

## 🧪 测试

### 测试命令
```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 📊 性能优化

### 已实现优化
- **图片优化**: 多分辨率适配
- **动画优化**: 使用原生驱动
- **内存管理**: 及时释放资源
- **启动优化**: 延迟加载非关键组件

### 性能指标
- **启动时间**: < 3秒
- **内存使用**: < 200MB
- **帧率**: 稳定60fps
- **包大小**: < 100MB

## 🔧 开发指南

### 添加新鱼类
1. 在 `src/data/fishDatabase.ts` 中添加鱼类数据
2. 在 `src/assets/images/` 中添加鱼类图标
3. 更新图鉴显示逻辑

### 添加新装备
1. 在 `src/data/equipment.ts` 中定义装备属性
2. 在商店页面中添加显示逻辑
3. 实现装备效果逻辑

### 添加新钓场
1. 在 `src/data/fishingScenes.ts` 中定义场景
2. 创建场景背景资源
3. 实现场景特殊规则

## 🐛 问题反馈

### 常见问题
1. **安装失败**: 检查Node.js版本，清理缓存重试
2. **构建失败**: 检查EAS配置，确保网络连接
3. **运行崩溃**: 检查设备兼容性，查看错误日志

### 反馈渠道
- GitHub Issues: [项目地址]/issues
- 邮箱: [联系邮箱]

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📞 联系我们

- 开发团队: [团队名称]
- 邮箱: [联系邮箱]
- 官网: [官网地址]

---

**路亚钓鱼大师** - 享受真实的钓鱼乐趣！🎣