# 斗地主 Mini App - 快速开始指南

## 🚀 5 分钟部署

### 步骤 1: 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名：`ddz-miniapp`
3. 公开仓库（Public）
4. 点击 "Create repository"

### 步骤 2: 推送代码

```bash
cd /root/.openclaw/workspace/bots/ddz-miniapp

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "🎮 斗地主 Mini App 初版"

# 关联远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/ddz-miniapp.git

# 推送到 main 分支
git branch -M main
git push -u origin main
```

### 步骤 3: 启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 **Settings** → **Pages**
3. Source: **Deploy from branch**
4. Branch: **main**, Folder: **/ (root)**
5. 点击 **Save**

等待 1-2 分钟，页面显示：
```
Your site is live at https://YOUR_USERNAME.github.io/ddz-miniapp/
```

### 步骤 4: 更新 Bot 配置

编辑文件：`/root/.openclaw/workspace/bots/ddz-miniapp/bot_handler.py`

```python
# 第 12 行，替换为你的 GitHub URL
MINI_APP_URL = "https://YOUR_USERNAME.github.io/ddz-miniapp/"
```

### 步骤 5: 重启 Bot

```bash
systemctl restart ddz-bot
```

### 步骤 6: 测试

在 Telegram 中：
1. 打开 `@willUltron_bot`
2. 发送 `/game`
3. 点击 "🎮 打开斗地主" 按钮
4. Mini App 应该打开并显示大厅界面

---

## 📱 创建 Telegram Mini App

### 通过 BotFather

1. 在 Telegram 搜索 `@BotFather`
2. 发送 `/newapp`
3. 选择 `@willUltron_bot`
4. 输入名称：`斗地主`
5. 输入描述：`经典斗地主游戏`
6. 上传图标（512x512 PNG）
7. 输入 URL: `https://YOUR_USERNAME.github.io/ddz-miniapp/`
8. 输入 Short name: `doudizhu`

完成后访问：
```
https://t.me/willUltron_bot/doudizhu
```

---

## 🎮 可用命令

| 命令 | 功能 |
|------|------|
| `/game` | 打开小程序 |
| `/游戏` | 打开小程序 |
| `/小程序` | 打开小程序 |
| `/miniapp` | 打开小程序 |

---

## 🐛 遇到问题？

### Mini App 打不开

1. 检查 GitHub Pages 是否启用
2. 检查 URL 是否正确（HTTPS）
3. 查看浏览器控制台错误

### Bot 没有反应

1. 检查 Bot 是否运行：`systemctl status ddz-bot`
2. 查看 Bot 日志：`journalctl -u ddz-bot -f`
3. 确认 bot_handler.py 已正确导入

### 页面显示空白

1. 打开浏览器控制台（F12）
2. 查看 Console 错误
3. 检查网络请求是否成功

---

## 📊 项目结构

```
ddz-miniapp/
├── index.html          # 主页面
├── css/
│   ├── style.css      # 样式
│   └── cards.css      # 牌面样式
├── js/
│   ├── app.js         # 主入口
│   ├── api.js         # API 通信
│   ├── cards.js       # 牌面工具
│   └── game.js        # 游戏逻辑
├── bot_handler.py      # Bot 处理器
└── .github/
    └── workflows/
        └── deploy.yml  # 自动部署
```

---

## 🎯 下一步

- [ ] 部署到 GitHub Pages
- [ ] 配置 Bot 菜单按钮
- [ ] 测试完整流程
- [ ] 完善游戏逻辑
- [ ] 添加音效和动画

---

## 📞 需要帮助？

检查以下文件：
- `README.md` - 项目说明
- `DEPLOY.md` - 详细部署指南
- `bot_handler.py` - Bot 端逻辑
