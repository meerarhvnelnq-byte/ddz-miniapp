# 🎮 斗地主 Mini App

> 轻量级 Telegram 斗地主小程序，基于 Telegram Web App 技术

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://meerarhvnelnq-byte.github.io/ddz-miniapp/)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-26A5E4)](https://t.me/willUltron_bot)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📖 项目介绍

这是一款运行在 Telegram 内的斗地主 Mini App（小程序），无需下载安装，即开即玩。

### 特点

- ✅ **轻量级** - 总代码量 <150KB，加载速度快
- ✅ **跨平台** - iOS/Android/Desktop 全平台支持
- ✅ **免费托管** - GitHub Pages 免费 HTTPS 托管
- ✅ **完整功能** - 发牌/叫分/出牌/结算/战绩/排行榜
- ✅ **规则完善** - 炸弹翻倍/春天/反春/托管

---

## 🎯 功能特性

### 核心游戏
- 🃏 完整扑克牌系统（54 张）
- 🎲 随机发牌算法
- 📢 叫分抢地主（1/2/3 分）
- 🎁 3 张底牌奖励
- 🤖 智能托管（15 秒倒计时）
- ✅ 牌型验证（11 种牌型）

### 游戏规则
- 💣 炸弹翻倍（x2）
- 🚀 王炸翻倍（x4）
- 🌸 春天检测（x2）
- 🔄 反春检测（x2）
- 👑 地主翻倍（x2）
- 📊 积分详细计算

### 用户系统
- 📅 每日签到（+10 分）
- 📊 积分榜查询
- 🏆 段位系统（黑铁 - 王者）
- 📜 战绩统计（胜率/对局数）
- 🥇 全服排行榜

### 界面设计
- 🎨 紫色渐变主题
- 📱 响应式设计
- ✨ 流畅动画
- 🔊 8 种场景音效
- 🎯 直观交互

---

## 🚀 快速开始

### 方式 1: Telegram 内打开（推荐）

1. 打开 Telegram
2. 搜索 `@willUltron_bot`
3. 发送 `/game`
4. 点击 "🎮 打开斗地主"

### 方式 2: 直接访问

访问：https://meerarhvnelnq-byte.github.io/ddz-miniapp/

（注意：部分功能需要在 Telegram 内使用）

---

## 📋 游戏规则

### 基本流程

```
1. 发牌 → 每人 17 张，留 3 张底牌
2. 叫分 → 1/2/3 分或不要
3. 确定地主 → 叫分最高者获得底牌
4. 出牌 → 轮流出牌，大者先出
5. 结算 → 先出完者获胜，计算积分
```

### 牌型大小

```
火箭 > 炸弹 > 其他牌型

单张 < 对子 < 三张 < 三带一 < 三带二
顺子 < 连对 < 飞机 < 飞机带单 < 飞机带对
```

### 翻倍规则

```
基础分：赢 +20，输 -10

最终积分 = 基础分 × 地主 × 炸弹 × 春天 × 反春

示例：
- 地主胜利：+20 × 2 = +40 分
- 地主 +1 炸弹胜利：+20 × 2 × 2 = +80 分
- 地主 + 春天 +2 炸弹：+20 × 2 × 2 × 2 × 2 = +320 分
```

### 牌型说明

| 牌型 | 说明 | 示例 |
|------|------|------|
| 单张 | 任意一张牌 | 3♠ |
| 对子 | 两张相同点数 | 3♠3♥ |
| 三张 | 三张相同点数 | 3♠3♥3♣ |
| 三带一 | 三张 + 一张单牌 | 333+4 |
| 三带二 | 三张 + 一对 | 333+44 |
| 顺子 | 5+ 张连续单牌 | 34567 |
| 连对 | 3+ 对连续对子 | 334455 |
| 飞机 | 2+ 个连续三张 | 333444 |
| 飞机带单 | 飞机 + 单牌 | 333444+5+6 |
| 飞机带对 | 飞机 + 对子 | 333444+55+66 |
| 炸弹 | 四张相同点数 | 3333 |
| 王炸 | 大王 + 小王 | 大王 + 小王 |

---

## 🛠️ 技术栈

### 前端
- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **JavaScript** - 游戏逻辑
- **Telegram WebApp SDK** - Telegram 集成

### 后端（可选）
- **Python 3** - Bot 后端
- **pyTelegramBotAPI** - Telegram Bot 框架
- **GitHub Pages** - 静态托管

### 工具
- **Git** - 版本控制
- **GitHub** - 代码托管

---

## 📁 项目结构

```
ddz-miniapp/
├── index.html              # 主页面（游戏界面）
├── css/
│   ├── style.css          # 主样式
│   └── cards.css          # 牌面样式
├── js/
│   ├── app.js             # 主入口
│   ├── api.js             # API 通信
│   ├── cards.js           # 牌面工具
│   ├── game.js            # 游戏逻辑
│   ├── utils.js           # 工具函数（牌型判断）
│   ├── history.js         # 战绩管理
│   └── sound.js           # 音效管理
├── assets/
│   ├── cards/             # 牌面图片（可选）
│   └── sounds/            # 音效文件（可选）
├── bot_handler.py          # Bot 处理器
├── README.md               # 项目说明
├── DEPLOY.md               # 部署指南
├── QUICKSTART.md           # 快速开始
└── PROJECT_SUMMARY.md      # 项目总结
```

---

## 🚀 部署指南

### 部署到 GitHub Pages

1. **创建 GitHub 仓库**
   ```bash
   cd ddz-miniapp
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin git@github.com:YOUR_USERNAME/ddz-miniapp.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 访问：https://github.com/YOUR_USERNAME/ddz-miniapp/settings/pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
   - 点击 Save

3. **等待部署**
   - 约 1-2 分钟后访问：https://YOUR_USERNAME.github.io/ddz-miniapp/

### 部署 Bot

参考 `DEPLOY.md` 详细指南。

---

## 🎮 使用教程

### 创建房间

1. 打开 Mini App
2. 点击 "🏠 创建房间"
3. 获得 6 位房间号
4. 分享给好友
5. 等待 3 人满员
6. 点击 "开始游戏"

### 加入房间

1. 打开 Mini App
2. 点击 "🚪 加入房间"
3. 输入 6 位房间号
4. 加入成功

### 游戏操作

- **叫分** - 选择 1/2/3 分或不要
- **选牌** - 点击手牌选择/取消
- **出牌** - 点击 "出牌" 按钮
- **不要** - 点击 "不要" 按钮
- **托管** - 点击 "托管" 开启自动出牌

### 查看战绩

- **积分榜** - 查看当前积分和段位
- **战绩** - 查看对局记录和胜率
- **排行榜** - 查看全服排名

---

## ❓ 常见问题

### Q: 如何开始游戏？
A: 在 Telegram 中打开 `@willUltron_bot`，发送 `/game` 即可。

### Q: 游戏免费吗？
A: 完全免费，无任何内购。

### Q: 可以离线玩吗？
A: 需要网络连接，但流量消耗极小。

### Q: 如何添加好友？
A: 目前支持房间号加入，好友系统开发中。

### Q: 战绩保存在哪里？
A: 保存在本地浏览器缓存中，清除缓存会丢失。

### Q: 如何重置战绩？
A: 清除浏览器缓存即可。

### Q: 支持多人对战吗？
A: 当前为单机版（模拟对手），多人对战开发中。

### Q: 如何反馈问题？
A: 联系 @will_adss 或在 GitHub 提交 Issue。

---

## 📊 项目统计

| 指标 | 数值 |
|------|------|
| 开发时间 | ~4 小时 |
| 代码文件 | 20 个 |
| 总代码量 | ~125KB |
| 功能模块 | 9 个 |
| 支持平台 | iOS/Android/Desktop |
| 托管成本 | 0 元（GitHub Pages） |

---

## 🎯 开发计划

### 已完成 ✅
- [x] 核心游戏逻辑
- [x] 牌型判断和验证
- [x] 翻倍规则
- [x] 托管功能
- [x] 音效系统
- [x] 战绩系统
- [x] 排行榜
- [x] 用户界面

### 开发中 🚧
- [ ] 多人实时对战
- [ ] 好友系统
- [ ] 聊天功能

### 计划中 📋
- [ ] 癞子模式
- [ ] 二人斗地主
- [ ] 比赛模式
- [ ] 成就系统
- [ ] 每日任务

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 📞 联系方式

- **Telegram**: [@will_adss](https://t.me/will_adss)
- **GitHub**: [meerarhvnelnq-byte](https://github.com/meerarhvnelnq-byte)
- **Bot**: [@willUltron_bot](https://t.me/willUltron_bot)

---

## 🙏 致谢

感谢以下开源项目：

- [Telegram WebApp SDK](https://core.telegram.org/bots/webapps)
- [pyTelegramBotAPI](https://github.com/eternnoir/pyTelegramBotAPI)

---

**🎮 祝您游戏愉快！** 🃏
