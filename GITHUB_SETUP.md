# GitHub 仓库设置指南

## 🔑 步骤 1: 添加 SSH 密钥到 GitHub

### 复制公钥
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIP09IZAav/WUrjqVTcDGgM4bLjh3kizDtDs6IJW6cCfT 1257960360@qq.com
```

### 操作步骤
1. 登录 GitHub: https://github.com
2. 点击右上角头像 → **Settings**
3. 左侧菜单：**SSH and GPG keys**
4. 点击 **New SSH key**
5. Title: `斗地主 Mini App Deploy Key`
6. Key type: 选择 **Authentication Key**
7. 粘贴上面的公钥
8. 点击 **Add SSH key**

---

## 📦 步骤 2: 创建 GitHub 仓库

### 方法 A: 通过网页创建
1. 访问 https://github.com/new
2. Repository name: `ddz-miniapp`
3. 选择 **Public** (公开)
4. **不要** 勾选 "Add a README file"
5. 点击 **Create repository**

### 方法 B: 使用 GitHub CLI (如果已安装)
```bash
gh repo create ddz-miniapp --public --source=. --remote=origin --push
```

---

## 🚀 步骤 3: 推送代码

### 重命名分支为 main
```bash
cd /root/.openclaw/workspace/bots/ddz-miniapp
git branch -M main
```

### 关联远程仓库（替换 YOUR_USERNAME）
```bash
git remote add origin git@github.com:YOUR_USERNAME/ddz-miniapp.git
```

### 推送代码
```bash
git push -u origin main
```

---

## 📄 步骤 4: 启用 GitHub Pages

1. 进入仓库页面：https://github.com/YOUR_USERNAME/ddz-miniapp
2. 点击 **Settings** → **Pages**
3. Build and deployment:
   - Source: **Deploy from a branch**
   - Branch: **main** / **/(root)**
4. 点击 **Save**

等待 1-2 分钟，页面会自动部署。

---

## ✅ 步骤 5: 验证部署

部署完成后，访问：
```
https://YOUR_USERNAME.github.io/ddz-miniapp/
```

应该能看到斗地主 Mini App 的主页面。

---

## 🔧 步骤 6: 更新 Bot 配置

编辑文件：`/root/.openclaw/workspace/bots/ddz-miniapp/bot_handler.py`

找到第 12 行：
```python
MINI_APP_URL = "https://will-adss.github.io/ddz-miniapp/"
```

替换为你的 URL：
```python
MINI_APP_URL = "https://YOUR_USERNAME.github.io/ddz-miniapp/"
```

保存后重启 Bot：
```bash
systemctl restart ddz-bot
```

---

## 🧪 步骤 7: 测试

在 Telegram 中：
1. 打开 `@willUltron_bot`
2. 发送 `/game`
3. 点击 "🎮 打开斗地主" 按钮
4. Mini App 应该打开并显示大厅

---

## 🐛 常见问题

### 问题 1: SSH 密钥认证失败
```
解决方案：
1. 确认已正确添加公钥到 GitHub
2. 测试连接：ssh -T git@github.com
3. 如果失败，重新生成密钥
```

### 问题 2: 推送失败
```
解决方案：
1. 确认远程仓库 URL 正确
2. 确认分支名称为 main
3. 检查网络连接
```

### 问题 3: GitHub Pages 未生效
```
解决方案：
1. 等待 2-5 分钟
2. 检查 Actions 是否完成：https://github.com/USER/ddz-miniapp/actions
3. 确认 index.html 在根目录
```

### 问题 4: Mini App 打不开
```
解决方案：
1. 检查 URL 是否正确（HTTPS）
2. 查看浏览器控制台错误（F12）
3. 确认 GitHub Pages 已启用
```

---

## 📊 完整命令清单

```bash
# 1. 配置 Git
git config --global user.name "will-adss"
git config --global user.email "1257960360@qq.com"

# 2. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "1257960360@qq.com" -f ~/.ssh/github_deploy -N ""

# 3. 添加公钥到 GitHub (手动操作)
cat ~/.ssh/github_deploy.pub

# 4. 初始化仓库
cd /root/.openclaw/workspace/bots/ddz-miniapp
git init
git add .
git commit -m "🎮 斗地主 Mini App v1.0"
git branch -M main

# 5. 关联远程（替换 YOUR_USERNAME）
git remote add origin git@github.com:YOUR_USERNAME/ddz-miniapp.git

# 6. 推送
git push -u origin main

# 7. 更新 Bot 配置
# 编辑 bot_handler.py 第 12 行，替换 URL

# 8. 重启 Bot
systemctl restart ddz-bot
```

---

## 🎯 检查清单

- [ ] SSH 密钥已添加到 GitHub
- [ ] 仓库已创建（公开）
- [ ] 代码已推送到 main 分支
- [ ] GitHub Pages 已启用
- [ ] 网站可访问
- [ ] bot_handler.py URL 已更新
- [ ] Bot 已重启
- [ ] Telegram 测试成功

---

## 📞 需要帮助？

查看其他文档：
- QUICKSTART.md - 快速开始
- DEPLOY.md - 详细部署指南
- PROJECT_SUMMARY.md - 项目总结
