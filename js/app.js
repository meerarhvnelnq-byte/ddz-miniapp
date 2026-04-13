// 主应用入口
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 斗地主 Mini App 启动');
  
  try {
    // 初始化 Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      console.log('✅ Telegram WebApp 已初始化');
    } else {
      console.warn('⚠️ 不在 Telegram 环境中');
    }
    
    // 获取用户信息
    const user = (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe) 
      ? window.Telegram.WebApp.initDataUnsafe.user 
      : null;
    
    if (!user) {
      // 非 Telegram 环境，显示提示
      document.getElementById('loading-screen').innerHTML = '<h2 style="color:white;text-align:center;">🎮 斗地主</h2><p style="color:white;text-align:center;">请在 Telegram 中打开</p>';
      return;
    }
    
    console.log('👤 用户:', user);
    
    // 设置用户信息显示
    const usernameEl = document.getElementById('username');
    const scoreEl = document.getElementById('user-score');
    if (usernameEl) {
      usernameEl.textContent = `@${user.username || user.first_name}`;
    }
    if (scoreEl) {
      scoreEl.textContent = '加载中...';
    }
    
    // 隐藏加载屏幕，显示大厅
    setTimeout(() => {
      document.getElementById('loading-screen').style.display = 'none';
      document.getElementById('lobby-screen').style.display = 'flex';
      console.log('✅ 大厅已显示');
    }, 500);
    
  } catch (e) {
    console.error('❌ 初始化失败:', e);
    document.getElementById('loading-screen').innerHTML = `<h2 style="color:white;">错误</h2><p style="color:white;">${e.message}</p>`;
  }
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
