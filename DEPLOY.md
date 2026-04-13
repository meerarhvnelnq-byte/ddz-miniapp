# 斗地主 Mini App 部署指南

## 📋 快速部署（GitHub Pages）

### 1. 创建 GitHub 仓库

```bash
cd /root/.openclaw/workspace/bots/ddz-miniapp
git init
git add .
git commit -m "Initial commit: 斗地主 Mini App"
```

### 2. 推送到 GitHub

```bash
# 在 GitHub 创建仓库后
git remote add origin https://github.com/YOUR_USERNAME/ddz-miniapp.git
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: main, folder: / (root)
5. Save

### 4. 获取 URL

等待 1-2 分钟，页面部署完成后：
```
https://YOUR_USERNAME.github.io/ddz-miniapp/
```

---

## 🔧 配置 Telegram Bot

### 1. 更新 Bot Handler

编辑 `/root/.openclaw/workspace/bots/ddz-miniapp/bot_handler.py`:

```python
# 替换为你的 GitHub Pages URL
MINI_APP_URL = "https://YOUR_USERNAME.github.io/ddz-miniapp/"
```

### 2. 集成到现有 Bot

在 `/root/.openclaw/workspace/bots/ddz/ddz_bot.py` 末尾添加:

```python
# 导入 Mini App 处理器
from ddz_miniapp.bot_handler import *

# 启动时设置菜单按钮
if __name__ == '__main__':
    setup_menu_button()  # 添加这行
    # ... 其他启动代码
```

### 3. 重启 Bot

```bash
systemctl restart ddz-bot
```

---

## 🎮 创建 Mini App

### 方式 1：通过 BotFather

1. 在 Telegram 搜索 `@BotFather`
2. 发送 `/newapp`
3. 选择 `@willUltron_bot`
4. 输入名称：`斗地主`
5. 输入描述：`经典斗地主游戏`
6. 上传图标（512x512 PNG）
7. 输入 URL: `https://YOUR_USERNAME.github.io/ddz-miniapp/`
8. 输入 Short name: `doudizhu`

### 方式 2：直接链接

用户可以直接访问：
```
https://t.me/willUltron_bot/doudizhu
```

---

## 📱 测试流程

### 1. 打开小程序

在 Telegram 中：
- 方式 A: 点击聊天菜单按钮 "🎮 斗地主"
- 方式 B: 发送 `/game` 命令
- 方式 C: 访问 `https://t.me/willUltron_bot/doudizhu`

### 2. 测试功能

- [ ] 加载页面
- [ ] 显示用户信息
- [ ] 创建房间
- [ ] 加入房间
- [ ] 游戏流程
- [ ] 积分查询
- [ ] 签到功能

---

## 🚀 生产环境优化

### 1. 自定义域名（可选）

```bash
# 购买域名
# 配置 DNS
# CNAME 指向 GitHub Pages

# CNAME 文件
echo "yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

### 2. HTTPS 证书

GitHub Pages 自动提供 HTTPS，无需额外配置。

### 3. 性能优化

- 启用 Gzip 压缩
- 使用 CDN
- 压缩图片资源
- 启用浏览器缓存

---

## 🐛 调试

### 1. 浏览器控制台

在 Telegram Desktop 中：
1. 打开小程序
2. 右键 → 检查元素
3. 查看 Console 和 Network

### 2. 移动端调试

iOS Safari:
1. 设置 → Safari → 高级 → 网页检查器（开启）
2. Mac Safari → 开发 → 选择设备

Android Chrome:
1. chrome://inspect
2. 选择设备调试

### 3. Bot 日志

```bash
journalctl -u ddz-bot -f
```

---

## 📊 监控

### 1. GitHub Pages 流量

仓库 → Insights → Traffic

### 2. Bot 使用统计

添加日志记录：
```python
print(f"📊 WebApp 请求：{action} - {user_id}")
```

---

## ⚠️ 注意事项

1. **URL 必须 HTTPS** - Telegram WebApp 要求 HTTPS
2. **跨域问题** - 确保 CORS 配置正确
3. **用户隐私** - 不要收集额外用户数据
4. **内容审核** - 遵守 Telegram 平台规范
5. **性能** - 首屏加载 < 3 秒

---

## 🎯 下一步

- [ ] 部署到 GitHub Pages
- [ ] 配置 Bot 菜单按钮
- [ ] 测试完整流程
- [ ] 收集用户反馈
- [ ] 持续优化

---

## 📞 支持

遇到问题？检查：
1. GitHub Pages 是否启用
2. URL 是否正确
3. Bot 是否重启
4. 浏览器控制台是否有错误
