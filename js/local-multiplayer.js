// 纯前端多人对战 - 使用 localStorage 模拟
const LocalMultiplayer = {
  userId: null,
  roomId: null,
  rooms: {},
  
  init() {
    this.userId = window.Telegram.WebApp.initDataUnsafe?.user?.id || 'player_' + Date.now();
    console.log('🎮 LocalMultiplayer 初始化，userId:', this.userId);
    
    // 从 localStorage 加载房间
    this.loadRooms();
  },
  
  loadRooms() {
    try {
      const data = localStorage.getItem('ddz_rooms');
      this.rooms = data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('加载房间失败:', e);
      this.rooms = {};
    }
  },
  
  saveRooms() {
    try {
      localStorage.setItem('ddz_rooms', JSON.stringify(this.rooms));
    } catch (e) {
      console.error('保存房间失败:', e);
    }
  },
  
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code;
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms[code]);
    return code;
  },
  
  // 创建房间
  createRoom() {
    const roomCode = this.generateRoomCode();
    this.roomId = roomCode;
    
    this.rooms[roomCode] = {
      id: roomCode,
      owner: this.userId,
      players: [{
        id: this.userId,
        name: window.Telegram.WebApp.initDataUnsafe?.user?.first_name || '玩家',
        joinedAt: Date.now()
      }],
      status: 'waiting',
      createdAt: Date.now()
    };
    
    this.saveRooms();
    console.log('🏠 房间创建成功:', roomCode);
    
    return {
      success: true,
      room: {
        room_id: roomCode,
        player_count: 1,
        max_players: 3,
        players: this.rooms[roomCode].players
      }
    };
  },
  
  // 加入房间
  joinRoom(roomCode) {
    const room = this.rooms[roomCode];
    
    if (!room) {
      return {
        success: false,
        error: '房间不存在'
      };
    }
    
    if (room.players.length >= 3) {
      return {
        success: false,
        error: '房间已满'
      };
    }
    
    if (room.players.find(p => p.id === this.userId)) {
      return {
        success: true,
        room: {
          room_id: roomCode,
          player_count: room.players.length,
          max_players: 3,
          players: room.players
        }
      };
    }
    
    room.players.push({
      id: this.userId,
      name: window.Telegram.WebApp.initDataUnsafe?.user?.first_name || '玩家',
      joinedAt: Date.now()
    });
    
    this.roomId = roomCode;
    this.saveRooms();
    
    return {
      success: true,
      room: {
        room_id: roomCode,
        player_count: room.players.length,
        max_players: 3,
        players: room.players
      }
    };
  },
  
  // 离开房间
  leaveRoom() {
    if (this.roomId && this.rooms[this.roomId]) {
      const room = this.rooms[this.roomId];
      room.players = room.players.filter(p => p.id !== this.userId);
      
      if (room.players.length === 0) {
        delete this.rooms[this.roomId];
      }
      
      this.saveRooms();
    }
    
    this.roomId = null;
    return { success: true };
  },
  
  // 获取房间信息
  getRoom(roomCode) {
    const room = this.rooms[roomCode];
    if (!room) {
      return {
        success: false,
        error: '房间不存在'
      };
    }
    
    return {
      success: true,
      room: {
        room_id: roomCode,
        player_count: room.players.length,
        max_players: 3,
        players: room.players,
        status: room.status
      }
    };
  },
  
  // 开始游戏
  startGame() {
    const room = this.rooms[this.roomId];
    
    if (!room) {
      return {
        success: false,
        error: '房间不存在'
      };
    }
    
    if (room.players.length < 2) {
      return {
        success: false,
        error: '至少需要 2 名玩家'
      };
    }
    
    room.status = 'playing';
    this.saveRooms();
    
    return {
      success: true,
      message: '游戏开始！'
    };
  }
};
