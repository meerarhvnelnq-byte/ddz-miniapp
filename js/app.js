// 主应用入口
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 斗地主 Mini App 启动');
  
  // 初始化 Telegram WebApp
  API.expandWebApp();
  
  // 获取用户信息
  const user = API.getUserInfo();
  if (!user) {
    alert('无法获取用户信息，请从 Telegram 打开');
    return;
  }
  
  console.log('👤 用户:', user);
  
  // 初始化游戏
  // chatId 和 userId 由 bot 通过 URL 参数传递
  const urlParams = new URLSearchParams(window.location.search);
  const chatId = urlParams.get('chat_id') || user.id;
  const userId = user.id;
  
  Game.init(chatId, userId);
  
  // 设置用户信息显示
  const usernameEl = document.getElementById('username');
  if (usernameEl) {
    usernameEl.textContent = `@${user.username || user.first_name}`;
  }
  
  // 绑定大厅按钮事件
  document.getElementById('create-room-btn').addEventListener('click', () => {
    Game.createRoom();
  });
  
  document.getElementById('join-room-btn').addEventListener('click', async () => {
    const code = prompt('请输入房间号:');
    if (code) {
      Game.joinRoom(code);
    }
  });
  
  document.getElementById('view-score-btn').addEventListener('click', () => {
    Game.viewScore();
  });
  
  document.getElementById('view-history-btn').addEventListener('click', () => {
    // TODO: 打开战绩页面
    alert('战绩功能开发中...');
  });
  
  document.getElementById('daily-btn').addEventListener('click', () => {
    Game.dailyClaim();
  });
  
  // 绑定游戏按钮事件
  document.getElementById('bid-1-btn').addEventListener('click', () => {
    Game.bid(1);
  });
  
  document.getElementById('bid-2-btn').addEventListener('click', () => {
    Game.bid(2);
  });
  
  document.getElementById('bid-3-btn').addEventListener('click', () => {
    Game.bid(3);
  });
  
  document.getElementById('no-bid-btn').addEventListener('click', () => {
    Game.bid(0);
  });
  
  document.getElementById('pass-btn').addEventListener('click', () => {
    Game.pass();
  });
  
  document.getElementById('play-btn').addEventListener('click', () => {
    Game.playCards();
  });
  
  document.getElementById('back-lobby-btn').addEventListener('click', () => {
    Game.quit();
  });
  
  // 监听 bot 返回数据
  API.setupMessageListener((data) => {
    console.log('📩 收到数据:', data);
    handleBotResponse(data);
  });
  
  // 隐藏加载屏幕
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('lobby-screen').style.display = 'flex';
  }, 1000);
});

// 处理 bot 响应
function handleBotResponse(data) {
  switch (data.type) {
    case 'room_created':
      Game.updateState({
        status: 'waiting',
        roomCode: data.room_code
      });
      break;
    
    case 'room_joined':
      Game.updateState({
        status: 'waiting',
        roomCode: data.room_code,
        players: data.players
      });
      break;
    
    case 'game_start':
      Game.updateState({
        status: 'playing',
        players: data.players,
        myHand: data.my_hand,
        landlord: data.landlord,
        landlordCards: data.landlord_cards,
        currentPlayer: data.current_player
      });
      break;
    
    case 'calling':
      Game.updateState({
        status: 'calling',
        players: data.players,
        current_player: data.current_player
      });
      break;
    
    case 'play_result':
      Game.updateState({
        myHand: data.my_hand,
        lastPlay: data.last_play,
        currentPlayer: data.current_player
      });
      break;
    
    case 'game_result':
      Game.updateState({
        status: 'result',
        winner: data.winner,
        winnerName: data.winner_name,
        scoreChange: data.score_change,
        myScore: data.my_score
      });
      break;
    
    case 'score':
      alert(`💰 你的积分：${data.score}分\n🎖️ 段位：${data.rank}`);
      break;
    
    case 'daily_claim':
      alert(`✅ 签到成功！\n+${data.reward}分\n连续签到：${data.consecutive}天`);
      break;
    
    case 'error':
      alert(`❌ 错误：${data.message}`);
      break;
  }
}
