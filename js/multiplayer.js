// 多人对战 WebSocket 客户端
const MultiplayerClient = {
  ws: null,
  connected: false,
  userId: null,
  roomId: null,
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,
  heartbeatInterval: null,
  
  // 连接服务器
  connect(userId, userInfo) {
    this.userId = userId;
    
    const wsUrl = this.getWebSocketUrl();
    console.log('🔌 尝试连接:', wsUrl);
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket 连接成功');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        
        if (this.onConnect) {
          this.onConnect();
        }
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📩 收到消息:', data.type, data);
          this.handleMessage(data);
        } catch (e) {
          console.error('解析消息失败:', e);
        }
      };
      
      this.ws.onclose = () => {
        console.log('❌ WebSocket 连接关闭');
        this.connected = false;
        this.stopHeartbeat();
        
        if (this.onDisconnect) {
          this.onDisconnect();
        }
        
        // 尝试重连
        this.tryReconnect(userId, userInfo);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
      };
      
    } catch (e) {
      console.error('创建 WebSocket 失败:', e);
    }
  },
  
  // 获取 WebSocket URL
  getWebSocketUrl() {
    // 开发环境用本地，生产环境用服务器
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'ws://localhost:8765';
    } else {
      // 生产环境：使用 wss 或根据域名推断
      return `wss://${host}/ws`;
      // 或者使用专门的 WebSocket 服务器
      // return 'wss://your-websocket-server.com:8765';
    }
  },
  
  // 处理消息
  handleMessage(data) {
    const handlers = {
      'room_created': (d) => this.onRoomCreated(d),
      'room_joined': (d) => this.onRoomJoined(d),
      'player_joined': (d) => this.onPlayerJoined(d),
      'player_left': (d) => this.onPlayerLeft(d),
      'player_disconnected': (d) => this.onPlayerDisconnected(d),
      'game_started': (d) => this.onGameStarted(d),
      'player_bid': (d) => this.onPlayerBid(d),
      'cards_played': (d) => this.onCardsPlayed(d),
      'player_passed': (d) => this.onPlayerPassed(d),
      'chat_message': (d) => this.onChatMessage(d),
      'heartbeat_ack': (d) => this.onHeartbeatAck(d)
    };
    
    const handler = handlers[data.type];
    if (handler) {
      handler(data);
    }
  },
  
  // 事件回调（由外部设置）
  onConnect: null,
  onDisconnect: null,
  onRoomCreated: null,
  onRoomJoined: null,
  onPlayerJoined: null,
  onPlayerLeft: null,
  onPlayerDisconnected: null,
  onGameStarted: null,
  onPlayerBid: null,
  onCardsPlayed: null,
  onPlayerPassed: null,
  onChatMessage: null,
  onHeartbeatAck: null,
  
  // 发送消息
  send(action, data = {}) {
    if (!this.connected || !this.ws) {
      console.warn('WebSocket 未连接');
      return false;
    }
    
    const message = {
      action,
      user_id: this.userId,
      room_id: this.roomId,
      ...data
    };
    
    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (e) {
      console.error('发送消息失败:', e);
      return false;
    }
  },
  
  // 创建房间
  createRoom(userInfo) {
    return this.send('create_room', { user_info: userInfo });
  },
  
  // 加入房间
  joinRoom(roomId, userInfo) {
    this.roomId = roomId;
    return this.send('join_room', { room_id: roomId, user_info: userInfo });
  },
  
  // 离开房间
  leaveRoom() {
    this.send('leave_room');
    this.roomId = null;
  },
  
  // 开始游戏
  startGame() {
    this.send('start_game', { room_id: this.roomId });
  },
  
  // 叫分
  bid(score) {
    this.send('bid', { score, room_id: this.roomId });
  },
  
  // 出牌
  playCards(cards) {
    this.send('play_cards', { cards, room_id: this.roomId });
  },
  
  // 不要
  pass() {
    this.send('pass', { room_id: this.roomId });
  },
  
  // 聊天
  chat(message) {
    this.send('chat', { message, room_id: this.roomId });
  },
  
  // 心跳
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send('heartbeat');
    }, 30000); // 30 秒一次
  },
  
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  },
  
  onHeartbeatAck(data) {
    console.log('💓 心跳响应:', data.timestamp);
  },
  
  // 重连
  tryReconnect(userId, userInfo) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('重连失败：超过最大尝试次数');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 ${delay}ms 后尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      console.log('🔄 尝试重连...');
      this.connect(userId, userInfo);
    }, delay);
  },
  
  // 断开连接
  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
  }
};
