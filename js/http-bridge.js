// HTTP 桥接 - 直接请求 Bot API
const HttpBridge = {
  apiEndpoint: 'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
  userId: null,
  roomId: null,
  
  init() {
    this.userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
    console.log('🌐 HttpBridge 初始化，userId:', this.userId);
  },
  
  // Cloudflare Tunnel HTTPS 地址（从 localStorage 读取，支持动态更新）
  apiEndpoint: localStorage.getItem('ddz_api_endpoint') || 'https://period-zip-homepage-purchased.trycloudflare.com/api/bot-game',
  
  init() {
    this.userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
    console.log('🌐 HttpBridge 初始化，userId:', this.userId, 'apiEndpoint:', this.apiEndpoint);
  },
  
  // 发送请求到 Bot
  async sendRequest(action, data = {}) {
    const payload = {
      action,
      room_id: this.roomId,
      user_id: this.userId,
      ...data
    };
    
    console.log('📤 发送请求:', payload);
    console.log('🌐 API 端点:', this.apiEndpoint);
    
    // 使用 fetch 请求 Cloudflare Tunnel
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log('📊 响应状态:', response.status);
      const result = await response.json();
      console.log('📩 收到响应:', result);
      return result;
      
    } catch (error) {
      console.error('❌ 请求失败:', error);
      console.error('❌ 错误详情:', error.message);
      throw error;
    }
  },
  
  // 创建房间
  async createRoom() {
    const result = await this.sendRequest('create_multiplayer_room');
    if (result.success && result.room) {
      this.roomId = result.room.room_id;
    }
    return result;
  },
  
  // 加入房间
  async joinRoom(roomId) {
    this.roomId = roomId;
    return await this.sendRequest('join_multiplayer_room', { data: { roomId } });
  },
  
  // 离开房间
  async leaveRoom() {
    const result = await this.sendRequest('leave_room');
    this.roomId = null;
    return result;
  },
  
  // 开始游戏
  async startGame() {
    return await this.sendRequest('start_multiplayer_game', { room_id: this.roomId });
  }
};
