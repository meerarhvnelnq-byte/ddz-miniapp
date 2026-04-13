// API 通信模块
const API = {
  baseURL: '', // 由 bot 动态设置
  chatId: null,
  userId: null,
  
  // 初始化
  init(chatId, userId) {
    this.chatId = chatId;
    this.userId = userId;
  },
  
  // 发送请求
  async send(action, data = {}) {
    const payload = {
      action,
      chat_id: this.chatId,
      user_id: this.userId,
      ...data
    };
    
    // 通过 WebApp sendData 发送给 bot
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.sendData(JSON.stringify(payload));
    }
    
    console.log('Sent:', payload);
    return payload;
  },
  
  // 创建房间
  async createRoom() {
    return this.send('create_room');
  },
  
  // 加入房间
  async joinRoom(code) {
    return this.send('join_room', { code });
  },
  
  // 抢地主
  async bid(score) {
    return this.send('bid', { score });
  },
  
  // 出牌
  async playCards(cards) {
    return this.send('play_cards', { cards });
  },
  
  // 不要
  async pass() {
    return this.send('pass');
  },
  
  // 查看手牌
  async getHand() {
    return this.send('get_hand');
  },
  
  // 查看积分
  async getScore() {
    return this.send('get_score');
  },
  
  // 签到
  async dailyClaim() {
    return this.send('daily_claim');
  },
  
  // 退出游戏
  async quit() {
    return this.send('quit');
  }
};

// 监听 bot 返回数据
function setupMessageListener(callback) {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.onEvent('message_received', (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (e) {
        console.error('Parse error:', e);
      }
    });
  }
}

// 展开 WebApp
function expandWebApp() {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    window.Telegram.WebApp.setHeaderColor('#667eea');
  }
}

// 获取用户信息
function getUserInfo() {
  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) {
    return window.Telegram.WebApp.initDataUnsafe.user;
  }
  return null;
}

// 主题颜色
function getThemeColor() {
  if (window.Telegram && window.Telegram.WebApp) {
    return {
      bg: window.Telegram.WebApp.backgroundColor || '#667eea',
      text: window.Telegram.WebApp.textColor || '#ffffff'
    };
  }
  return { bg: '#667eea', text: '#ffffff' };
}
