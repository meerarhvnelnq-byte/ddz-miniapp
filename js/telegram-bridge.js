// Telegram Bot 通信桥接
// 通过 Telegram.WebApp.sendData() 发送数据给 Bot

const TelegramBridge = {
  connected: false,
  userId: null,
  roomId: null,
  pendingCallbacks: {},
  
  // 初始化
  init() {
    console.log('🤖 TelegramBridge 初始化');
    this.userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
    this.connected = true;
    
    // 监听 Bot 返回的数据
    window.Telegram.WebApp.onEvent('message_received', (event) => {
      console.log('📩 收到 Bot 消息:', event);
      this.handleBotMessage(event.data);
    });
  },
  
  // 发送数据到 Bot
  sendToBot(action, data = {}) {
    if (!this.connected) {
      console.error('❌ Bot 未连接');
      return Promise.reject(new Error('Bot 未连接'));
    }
    
    const message = {
      action,
      room_id: this.roomId,
      ...data
    };
    
    console.log('📤 发送到 Bot:', message);
    
    // 使用 Telegram.WebApp.sendData()
    window.Telegram.WebApp.sendData(JSON.stringify(message));
    
    // 返回 Promise，等待 Bot 响应
    return new Promise((resolve, reject) => {
      const callbackId = action + '_' + Date.now();
      this.pendingCallbacks[callbackId] = { resolve, reject, timeout: null };
      
      // 设置超时
      this.pendingCallbacks[callbackId].timeout = setTimeout(() => {
        delete this.pendingCallbacks[callbackId];
        reject(new Error('等待 Bot 响应超时'));
      }, 10000);
    });
  },
  
  // 处理 Bot 返回的消息
  handleBotMessage(data) {
    try {
      const response = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('📩 Bot 响应:', response);
      
      // 查找对应的回调
      const callbackId = Object.keys(this.pendingCallbacks).find(
        id => response.action && id.startsWith(response.action.split('_')[0])
      );
      
      if (callbackId) {
        const callback = this.pendingCallbacks[callbackId];
        clearTimeout(callback.timeout);
        delete this.pendingCallbacks[callbackId];
        
        if (response.success) {
          callback.resolve(response);
        } else {
          callback.reject(new Error(response.error || '操作失败'));
        }
      }
      
      // 触发相应的事件
      this.triggerEvent(response);
      
    } catch (e) {
      console.error('解析 Bot 消息失败:', e);
    }
  },
  
  // 触发事件
  triggerEvent(response) {
    const action = response.action;
    
    const handlers = {
      'room_created': () => this.onRoomCreated && this.onRoomCreated(response),
      'room_joined': () => this.onRoomJoined && this.onRoomJoined(response),
      'room_left': () => this.onRoomLeft && this.onRoomLeft(response),
      'game_started': () => this.onGameStarted && this.onGameStarted(response),
      'player_bid': () => this.onPlayerBid && this.onPlayerBid(response),
      'cards_played': () => this.onCardsPlayed && this.onCardsPlayed(response),
      'player_passed': () => this.onPlayerPassed && this.onPlayerPassed(response),
      'game_result': () => this.onGameResult && this.onGameResult(response)
    };
    
    const handler = handlers[action];
    if (handler) {
      handler();
    }
  },
  
  // 事件回调
  onRoomCreated: null,
  onRoomJoined: null,
  onRoomLeft: null,
  onGameStarted: null,
  onPlayerBid: null,
  onCardsPlayed: null,
  onPlayerPassed: null,
  onGameResult: null,
  
  // 创建房间
  async createRoom() {
    console.log('🏠 创建房间');
    const response = await this.sendToBot('create_room');
    
    if (response.success && response.room) {
      this.roomId = response.room.room_id;
    }
    
    return response;
  },
  
  // 加入房间
  async joinRoom(roomId) {
    console.log('🚪 加入房间:', roomId);
    this.roomId = roomId;
    return await this.sendToBot('join_room', { room_id: roomId });
  },
  
  // 离开房间
  async leaveRoom() {
    console.log('👋 离开房间');
    const response = await this.sendToBot('leave_room');
    this.roomId = null;
    return response;
  },
  
  // 开始游戏
  async startGame() {
    console.log('🎮 开始游戏');
    return await this.sendToBot('start_game', { room_id: this.roomId });
  },
  
  // 叫分
  async bid(score) {
    console.log('📢 叫分:', score);
    return await this.sendToBot('bid', { 
      room_id: this.roomId,
      score 
    });
  },
  
  // 出牌
  async playCards(cards) {
    console.log('🃏 出牌:', cards);
    return await this.sendToBot('play_cards', {
      room_id: this.roomId,
      cards
    });
  },
  
  // 不要
  async pass() {
    console.log('✋ 不要');
    return await this.sendToBot('pass', { room_id: this.roomId });
  },
  
  // 获取游戏状态
  async getGameState() {
    return await this.sendToBot('get_state', { room_id: this.roomId });
  }
};
