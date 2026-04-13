#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
斗地主 Mini App - Bot 端处理器
集成到现有 ddz_bot.py 中
"""

from telebot import types
import json
import os

# Mini App URL - 部署后替换为实际地址
MINI_APP_URL = "https://meerarhvnelnq-byte.github.io/ddz-miniapp/"

# 文件路径
SCORES_FILE = "/root/.openclaw/workspace/bots/ddz/scores.json"
DAILY_FILE = "/root/.openclaw/workspace/bots/ddz/daily-claim.json"

# 游戏/小程序命令
@bot.message_handler(commands=['game', '游戏', '小程序', 'miniapp'])
def open_miniapp(message):
    """打开斗地主小程序"""
    markup = types.InlineKeyboardMarkup()
    webapp_btn = types.InlineKeyboardButton(
        text="🎮 打开斗地主",
        web_app=types.WebAppInfo(url=MINI_APP_URL)
    )
    markup.add(webapp_btn)
    
    bot.reply_to(message, "点击下方按钮打开斗地主小程序：", reply_markup=markup)


# 添加菜单按钮到所有消息（可选）
def add_webapp_button(message, text="🎮 玩游戏"):
    """给消息添加 WebApp 按钮"""
    markup = types.InlineKeyboardMarkup()
    webapp_btn = types.InlineKeyboardButton(
        text=text,
        web_app=types.WebAppInfo(url=MINI_APP_URL)
    )
    markup.add(webapp_btn)
    return markup


# 处理 WebApp 发送的数据
@bot.message_handler(content_types=['web_app_data'])
def handle_webapp_data(message):
    """处理 Mini App 发送的游戏数据"""
    try:
        data = json.loads(message.web_app_data.data)
        user_id = message.from_user.id
        chat_id = message.chat.id
        
        print(f"📩 收到 WebApp 数据：{data}")
        
        # 根据 action 处理不同请求
        action = data.get('action')
        
        if action == 'create_room':
            handle_create_room(message, user_id, chat_id, data)
        elif action == 'join_room':
            handle_join_room(message, user_id, chat_id, data)
        elif action == 'bid':
            handle_bid(message, user_id, chat_id, data)
        elif action == 'play_cards':
            handle_play_cards(message, user_id, chat_id, data)
        elif action == 'pass':
            handle_pass(message, user_id, chat_id, data)
        elif action == 'get_score':
            handle_get_score(message, user_id, chat_id, data)
        elif action == 'daily_claim':
            handle_daily_claim(message, user_id, chat_id, data)
        elif action == 'quit':
            handle_quit(message, user_id, chat_id, data)
        else:
            print(f"⚠️ 未知 action: {action}")
            
    except Exception as e:
        print(f"❌ 处理 WebApp 数据失败：{e}")


def load_scores():
    """加载积分"""
    if os.path.exists(SCORES_FILE):
        with open(SCORES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def load_daily():
    """加载签到记录"""
    if os.path.exists(DAILY_FILE):
        with open(DAILY_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def get_rank(score):
    """根据积分获取段位"""
    if score >= 3000: return "王者"
    if score >= 2500: return "宗师"
    if score >= 2000: return "大师"
    if score >= 1500: return "钻石"
    if score >= 1000: return "翡翠"
    if score >= 800: return "铂金"
    if score >= 600: return "黄金"
    if score >= 400: return "白银"
    if score >= 200: return "青铜"
    return "黑铁"


def handle_create_room(message, user_id, chat_id, data):
    """处理创建房间"""
    # 生成房间号
    import random
    room_code = ''.join(random.choices('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', k=6))
    
    # 获取用户信息
    username = message.from_user.username or message.from_user.first_name
    
    response = {
        "type": "room_created",
        "room_code": room_code,
        "creator": username,
        "status": "waiting"
    }
    
    # 发送数据给 Mini App
    bot.send_message(user_id, json.dumps(response))
    
    # 在群聊中通知
    bot.send_message(chat_id, f"🏠 @{username} 创建了房间\n房间号：{room_code}\n\n使用 /join {room_code} 加入游戏")


def handle_join_room(message, user_id, chat_id, data):
    """处理加入房间"""
    code = data.get('code')
    username = message.from_user.username or message.from_user.first_name
    
    # TODO: 检查房间是否存在
    # 这里简化处理，直接返回成功
    
    response = {
        "type": "room_joined",
        "room_code": code,
        "status": "waiting",
        "players": [
            {"id": user_id, "username": username, "cards": 17}
        ]
    }
    
    bot.send_message(user_id, json.dumps(response))
    bot.send_message(chat_id, f"🚪 @{username} 加入了房间 {code}")


def handle_bid(message, user_id, chat_id, data):
    """处理叫分"""
    score = data.get('score', 0)
    username = message.from_user.username or message.from_user.first_name
    
    # 叫分文本
    bid_text = {0: "不抢", 1: "1 分", 2: "2 分", 3: "3 分"}
    
    response = {
        "type": "bid_result",
        "player": username,
        "score": score,
        "text": bid_text.get(score, "未知")
    }
    bot.send_message(user_id, json.dumps(response))
    bot.send_message(chat_id, f"📢 @{username} {bid_text.get(score, '')}")


def handle_play_cards(message, user_id, chat_id, data):
    """处理出牌"""
    cards = data.get('cards', [])
    username = message.from_user.username or message.from_user.first_name
    
    # 发送数据给 Mini App
    response = {
        "type": "play_result",
        "player": username,
        "cards": cards,
        "cards_str": " ".join(cards)
    }
    bot.send_message(user_id, json.dumps(response))
    
    # 在群聊中显示
    bot.send_message(chat_id, f"🃏 @{username} 出牌：{' '.join(cards)}")


def handle_pass(message, user_id, chat_id, data):
    """处理不要"""
    username = message.from_user.username or message.from_user.first_name
    
    response = {
        "type": "pass_result",
        "player": username
    }
    bot.send_message(user_id, json.dumps(response))
    bot.send_message(chat_id, f"❌ @{username}：不要")


def handle_get_score(message, user_id, chat_id, data):
    """处理查看积分"""
    scores = load_scores()
    score = scores.get(str(user_id), 100)
    rank_name = get_rank(score)
    
    # 段位图标
    rank_icons = {
        "王者": "👑", "宗师": "🌟", "大师": "✨",
        "钻石": "💠", "翡翠": "🍀", "铂金": "💍",
        "黄金": "🥇", "白银": "🥈", "青铜": "🥉", "黑铁": "🪨"
    }
    rank_icon = rank_icons.get(rank_name, "🎮")
    
    response = {
        "type": "score",
        "score": score,
        "rank": f"{rank_icon} {rank_name}",
        "rank_name": rank_name
    }
    bot.send_message(user_id, json.dumps(response))


def handle_daily_claim(message, user_id, chat_id, data):
    """处理签到"""
    from datetime import datetime, timedelta
    
    scores = load_scores()
    daily = load_daily()
    
    today = datetime.now().strftime("%Y-%m-%d")
    user_key = str(user_id)
    
    # 初始化用户记录
    if user_key not in daily:
        daily[user_key] = {
            "last_claim": "",
            "total_claims": 0,
            "consecutive_days": 0,
            "max_consecutive": 0
        }
    
    user_claim = daily[user_key]
    last_claim = user_claim.get("last_claim", "")
    
    # 检查是否已签到
    if last_claim == today:
        response = {
            "type": "error",
            "message": f"今日已签到\n连续签到：{user_claim.get('consecutive_days', 0)}天"
        }
        bot.send_message(user_id, json.dumps(response))
        return
    
    # 计算连续签到
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    if last_claim == yesterday:
        user_claim["consecutive_days"] = user_claim.get("consecutive_days", 0) + 1
    else:
        user_claim["consecutive_days"] = 1
    
    # 更新记录
    user_claim["last_claim"] = today
    user_claim["total_claims"] = user_claim.get("total_claims", 0) + 1
    if user_claim["consecutive_days"] > user_claim.get("max_consecutive", 0):
        user_claim["max_consecutive"] = user_claim["consecutive_days"]
    
    daily[user_key] = user_claim
    
    # 发放奖励
    score = scores.get(user_key, 100)
    new_score = score + 10
    scores[user_key] = new_score
    
    # 保存数据
    with open(SCORES_FILE, 'w', encoding='utf-8') as f:
        json.dump(scores, f, ensure_ascii=False, indent=2)
    with open(DAILY_FILE, 'w', encoding='utf-8') as f:
        json.dump(daily, f, ensure_ascii=False, indent=2)
    
    # 计算新段位
    rank_name = get_rank(new_score)
    rank_icons = {
        "王者": "👑", "宗师": "🌟", "大师": "✨",
        "钻石": "💠", "翡翠": "🍀", "铂金": "💍",
        "黄金": "🥇", "白银": "🥈", "青铜": "🥉", "黑铁": "🪨"
    }
    rank_icon = rank_icons.get(rank_name, "🎮")
    
    # 连续签到奖励
    consecutive_bonus = ""
    if user_claim["consecutive_days"] >= 7:
        consecutive_bonus = "\n🔥 连续签到 7 天！太棒了！"
    elif user_claim["consecutive_days"] >= 3:
        consecutive_bonus = "\n🔥 连续签到 3 天！继续加油！"
    
    response = {
        "type": "daily_claim",
        "reward": 10,
        "old_score": score,
        "new_score": new_score,
        "rank": f"{rank_icon} {rank_name}",
        "consecutive": user_claim["consecutive_days"],
        "total": user_claim["total_claims"],
        "bonus": consecutive_bonus
    }
    bot.send_message(user_id, json.dumps(response))


def handle_quit(message, user_id, chat_id, data):
    """处理退出"""
    username = message.from_user.username or message.from_user.first_name
    
    response = {
        "type": "quit_result",
        "player": username
    }
    bot.send_message(user_id, json.dumps(response))
    bot.send_message(chat_id, f"👋 @{username} 退出了游戏")


# 设置菜单按钮（可选）
def setup_menu_button():
    """设置聊天菜单按钮为 Mini App"""
    try:
        bot.set_chat_menu_button(
            menu_button=types.MenuButtonWebApp(
                text="🎮 斗地主",
                web_app=types.WebAppInfo(url=MINI_APP_URL)
            )
        )
        print("✅ 菜单按钮已设置")
    except Exception as e:
        print(f"❌ 设置菜单按钮失败：{e}")


# 调试辅助函数
def test_webapp_flow():
    """测试 WebApp 流程"""
    print("🧪 测试 WebApp 功能...")
    print(f"Mini App URL: {MINI_APP_URL}")
    print("可用命令：/game, /游戏，/小程序，/miniapp")
    print("\n测试步骤:")
    print("1. 在 Telegram 发送 /game")
    print("2. 点击 WebApp 按钮")
    print("3. 测试创建房间")
    print("4. 测试签到功能")
    print("5. 查看 Bot 日志")
