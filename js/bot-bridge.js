// Bot 通信桥接模块
// 通过 Telegram Bot API 传递游戏消息，避免直接 WebSocket 连接

const BotBridge = {
  botUsername: 'willUltron_bot',
  gameSession: null,
  
  // 初始化
  init() {
    console.log('🤖 BotBridge 初始化');
    this.gameSession = null;
  },
  
  // 创建游戏房间
  async createRoom() {
    console.log('🏠 通过 Bot 创建房间');
    
    // 发送消息给 Bot
    const response = await this.sendToBot('create_multiplayer_room', {});
    
    if (response.success) {
      this.gameSession = {
        roomId: response.roomId,
        players: response.players,
        isOwner: true
      };
      return response;
    }
    
    throw new Error('创建房间失败');
  },
  
  // 加入游戏房间
  async joinRoom(roomId) {
    console.log('🚪 通过 Bot 加入房间:', roomId);
    
    const response = await this.sendToBot('join_multiplayer_room', { roomId });
    
    if (response.success) {
      this.gameSession = {
        roomId: roomId,
        players: response.players,
        isOwner: false
      };
      return response;
    }
    
    throw new Error('加入房间失败');
  },
  
  // 发送消息到 Bot
  async sendToBot(action, data) {
    const url = `/api/bot-game?action=${action}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          data,
          user: window.Telegram.WebApp.initDataUnsafe?.user
        })
      });
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('发送消息到 Bot 失败:', error);
      throw error;
    }
  },
  
  // 开始游戏
  async startGame() {
    console.log('🎮 通过 Bot 开始游戏');
    return await this.sendToBot('start_multiplayer_game', {
      roomId: this.gameSession.roomId
    });
  },
  
  // 叫分
  async bid(score) {
    console.log('📢 叫分:', score);
    return await this.sendToBot('multiplayer_bid', {
      roomId: this.gameSession.roomId,
      score
    });
  },
  
  // 出牌
  async playCards(cards) {
    console.log('🃏 出牌:', cards);
    return await this.sendToBot('multiplayer_play_cards', {
      roomId: this.gameSession.roomId,
      cards
    });
  },
  
  // 不要
  async pass() {
    console.log('✋ 不要');
    return await this.sendToBot('multiplayer_pass', {
      roomId: this.gameSession.roomId
    });
  },
  
  // 获取游戏状态
  async getGameState() {
    return await this.sendToBot('get_multiplayer_state', {
      roomId: this.gameSession.roomId
    });
  },
  
  // 离开房间
  async leaveRoom() {
    console.log('👋 离开房间');
    await this.sendToBot('leave_multiplayer_room', {
      roomId: this.gameSession.roomId
    });
    this.gameSession = null;
  }
};
