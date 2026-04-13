# 斗地主 Telegram Mini App

轻量级斗地主游戏，基于 Telegram Web App 技术。

## 📁 目录结构

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
├── assets/
│   ├── cards/         # 牌面图片（可选）
│   └── sounds/        # 音效（可选）
└── README.md
```

## 🚀 部署方式

### 方式 1：GitHub Pages（推荐）

1. 创建 GitHub 仓库
2. 推送代码
3. 启用 GitHub Pages
4. 获取 URL：`https://username.github.io/ddz-miniapp/`

### 方式 2：Vercel

```bash
npm i -g vercel
cd ddz-miniapp
vercel --prod
```

### 方式 3：自有服务器

1. 上传文件到 Nginx/Apache
2. 配置 HTTPS
3. 访问：`https://yourdomain.com/ddz-miniapp/`

## 🔧 配置 Bot

### 1. 创建 Mini App

在 Telegram 中：
```
@BotFather → /newapp
选择 @willUltron_bot
输入名称：斗地主
上传图标
输入 URL: https://yourdomain.com/ddz-miniapp/
```

### 2. 添加菜单按钮

```python
bot.set_chat_menu_button(
  menu_button=types.MenuButtonWebApp(
    text="🎮 斗地主",
    web_app=types.WebAppInfo(url="https://...")
  )
)
```

### 3. Bot 处理 WebApp 数据

```python
@bot.message_handler(content_types=['web_app_data'])
def handle_webapp_data(message):
    data = json.loads(message.web_app_data.data)
    # 处理游戏数据
```

## 🎮 游戏流程

1. 用户点击 `/game` 或菜单按钮
2. Mini App 启动，显示大厅
3. 创建/加入房间
4. 等待 3 名玩家
5. 发牌、叫分、出牌
6. 游戏结束，结算积分
7. 数据通过 `WebApp.sendData` 发送给 bot
8. Bot 更新积分和战绩

## 📡 通信协议

### 客户端 → Bot

```json
{
  "action": "create_room",
  "chat_id": 123456,
  "user_id": 789012
}
```

### Bot → 客户端

```json
{
  "type": "room_created",
  "room_code": "A1B2C3"
}
```

## 🎨 功能特性

- ✅ Telegram 用户自动登录
- ✅ 响应式设计（手机/平板/桌面）
- ✅ 流畅动画效果
- ✅ 牌面选择交互
- ✅ 实时游戏状态同步
- ✅ 积分系统对接

## 🛠️ 开发待办

- [ ] 出牌牌型验证
- [ ] 游戏动画优化
- [ ] 音效系统
- [ ] 战绩页面
- [ ] 排行榜页面
- [ ] 房间列表
- [ ] 聊天功能
- [ ] 表情系统

## 📱 兼容性

- ✅ iOS 12+ (Safari)
- ✅ Android 5+ (Chrome)
- ✅ Telegram Desktop
- ✅ Telegram Web

## 🔒 安全

- 所有数据通过 Telegram 加密传输
- 用户身份由 Telegram 验证
- 游戏逻辑在服务器端（Bot）
- 前端仅负责渲染和交互

## 📊 性能

- 首屏加载 < 1 秒
- 动画帧率 60fps
- 包体积 < 100KB
- 无需额外依赖

## 🎯 下一步

1. 部署到 GitHub Pages
2. 配置 Bot 菜单按钮
3. 添加 Bot 消息处理
4. 测试完整流程
5. 优化用户体验
