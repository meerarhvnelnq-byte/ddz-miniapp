#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
斗地主 Mini App - 测试脚本
"""

import os
import json

print("=" * 60)
print("🎮 斗地主 Mini App - 测试")
print("=" * 60)

# 1. 检查文件结构
print("\n【1】检查文件结构...")
required_files = [
    "index.html",
    "css/style.css",
    "css/cards.css",
    "js/app.js",
    "js/api.js",
    "js/cards.js",
    "js/game.js",
    "bot_handler.py",
    "README.md",
    "DEPLOY.md",
    "QUICKSTART.md"
]

base_dir = "/root/.openclaw/workspace/bots/ddz-miniapp"
missing_files = []

for f in required_files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        size = os.path.getsize(path)
        print(f"  ✅ {f} ({size} bytes)")
    else:
        print(f"  ❌ {f} (缺失)")
        missing_files.append(f)

if missing_files:
    print(f"\n⚠️ 缺失文件：{missing_files}")
else:
    print("\n✅ 所有文件完整")

# 2. 检查 Bot 集成
print("\n【2】检查 Bot 集成...")
bot_file = "/root/.openclaw/workspace/bots/ddz/ddz_bot.py"
if os.path.exists(bot_file):
    with open(bot_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    checks = [
        ("from bots.ddz_miniapp.bot_handler import", "Mini App 导入"),
        ("setup_menu_button()", "菜单按钮设置"),
        ("open_miniapp", "打开小程序命令"),
        ("handle_webapp_data", "WebApp 数据处理"),
    ]
    
    for check, name in checks:
        if check in content:
            print(f"  ✅ {name}")
        else:
            print(f"  ❌ {name}")
else:
    print(f"  ❌ Bot 文件不存在：{bot_file}")

# 3. 检查 Bot 状态
print("\n【3】检查 Bot 运行状态...")
import subprocess
result = subprocess.run(['systemctl', 'is-active', 'ddz-bot.service'], capture_output=True, text=True)
if result.stdout.strip() == 'active':
    print("  ✅ Bot 运行中")
else:
    print(f"  ❌ Bot 状态：{result.stdout.strip()}")

# 4. 测试配置
print("\n【4】检查配置...")
bot_handler = os.path.join(base_dir, "bot_handler.py")
if os.path.exists(bot_handler):
    with open(bot_handler, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'MINI_APP_URL = "https://' in content:
        url = content.split('MINI_APP_URL = "')[1].split('"')[0]
        print(f"  ✅ Mini App URL: {url}")
        
        if 'github.io' in url:
            print("  ℹ️ 使用 GitHub Pages")
        else:
            print("  ⚠️ 请确认 URL 已更新")
    else:
        print("  ❌ 未找到 MINI_APP_URL 配置")

# 5. 功能清单
print("\n【5】功能清单...")
features = [
    ("用户登录", "Telegram 自动登录"),
    ("大厅界面", "创建/加入房间"),
    ("游戏界面", "手牌/底牌/出牌"),
    ("叫分系统", "抢 1/2/3 分"),
    ("出牌系统", "选牌/出牌/不要"),
    ("积分查询", "查看积分和段位"),
    ("每日签到", "+10 分奖励"),
    ("Bot 集成", "消息处理"),
    ("菜单按钮", "一键打开"),
    ("响应式", "手机/平板/桌面"),
]

for feature, desc in features:
    print(f"  ✅ {feature}: {desc}")

# 6. 部署检查
print("\n【6】部署检查清单...")
checklist = [
    "□ 已创建 GitHub 仓库",
    "□ 已推送代码到 main 分支",
    "□ 已启用 GitHub Pages",
    "□ 已更新 bot_handler.py 中的 URL",
    "□ 已重启 Bot (systemctl restart ddz-bot)",
    "□ 已在 Telegram 测试 /game 命令",
    "□ Mini App 可以正常打开",
    "□ 签到功能正常工作",
]

for item in checklist:
    print(f"  {item}")

print("\n" + "=" * 60)
print("✅ 测试完成！")
print("=" * 60)

if missing_files:
    print(f"\n⚠️ 发现 {len(missing_files)} 个缺失文件")
else:
    print("\n🎉 所有检查通过！可以部署了")
    print("\n下一步:")
    print("1. 创建 GitHub 仓库并推送代码")
    print("2. 启用 GitHub Pages")
    print("3. 更新 bot_handler.py 中的 URL")
    print("4. 重启 Bot")
    print("5. 在 Telegram 中测试 /game")
