// 游戏逻辑模块
const Game = {
  state: {
    status: 'lobby', // lobby, waiting, calling, playing, result
    chatId: null,
    roomCode: null,
    myUserId: null,
    players: [],
    myHand: [],
    landlord: null,
    landlordCards: [],
    lastPlay: null,
    currentPlayer: null,
    bids: {}
  },
  
  // 初始化游戏
  init(chatId, userId) {
    this.state.chatId = chatId;
    this.state.myUserId = userId;
    API.init(chatId, userId);
  },
  
  // 更新状态
  updateState(data) {
    Object.assign(this.state, data);
    UI.render(this.state);
  },
  
  // 创建房间
  async createRoom() {
    showLoading();
    await API.createRoom();
  },
  
  // 加入房间
  async joinRoom(code) {
    showLoading();
    await API.joinRoom(code);
  },
  
  // 抢地主
  async bid(score) {
    await API.bid(score);
    UI.showMessage('叫分中...');
  },
  
  // 出牌
  async playCards() {
    const handElement = document.getElementById('my-hand');
    const selectedCards = Cards.getSelectedCards(handElement);
    
    if (selectedCards.length === 0) {
      UI.showMessage('请选择要出的牌');
      return;
    }
    
    await API.playCards(selectedCards);
    Cards.clearSelection(handElement);
  },
  
  // 不要
  async pass() {
    await API.pass();
  },
  
  // 查看积分
  async viewScore() {
    showLoading();
    await API.getScore();
  },
  
  // 签到
  async dailyClaim() {
    showLoading();
    await API.dailyClaim();
  },
  
  // 退出游戏
  async quit() {
    await API.quit();
    this.reset();
    UI.showLobby();
  },
  
  // 重置游戏
  reset() {
    this.state = {
      status: 'lobby',
      chatId: this.state.chatId,
      roomCode: null,
      myUserId: this.state.myUserId,
      players: [],
      myHand: [],
      landlord: null,
      landlordCards: [],
      lastPlay: null,
      currentPlayer: null,
      bids: {}
    };
  }
};

// UI 渲染模块
const UI = {
  // 渲染游戏状态
  render(state) {
    console.log('🎮 渲染状态:', state.status);
    switch (state.status) {
      case 'lobby':
        this.showLobby();
        break;
      case 'waiting':
        this.showWaitingRoom(state);
        break;
      case 'calling':
        this.showCalling(state);
        break;
      case 'playing':
        this.showPlaying(state);
        break;
      case 'result':
        this.showResult(state);
        break;
    }
  },
  
  // 显示大厅
  showLobby() {
    console.log('✅ 显示大厅');
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('lobby-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
  },
  
  // 显示等待房间
  showWaitingRoom(state) {
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    
    // 显示房间号
    const roomCodeDisplay = document.getElementById('room-code-display');
    roomCodeDisplay.style.display = 'block';
    document.getElementById('room-code').textContent = state.roomCode || '等待中...';
  },
  
  // 显示叫分阶段
  showCalling(state) {
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('result-screen').style.display = 'none';
    
    // 显示叫分按钮
    document.getElementById('bid-1-btn').style.display = 'inline-block';
    document.getElementById('bid-2-btn').style.display = 'inline-block';
    document.getElementById('bid-3-btn').style.display = 'inline-block';
    document.getElementById('no-bid-btn').style.display = 'inline-block';
    document.getElementById('pass-btn').style.display = 'none';
    document.getElementById('play-btn').style.display = 'none';
    
    this.showMessage('请叫分');
  },
  
  // 显示游戏进行中
  showPlaying(state) {
    document.getElementById('lobby-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('result-screen').style.display = 'none';
    
    // 隐藏叫分按钮
    document.getElementById('bid-1-btn').style.display = 'none';
    document.getElementById('bid-2-btn').style.display = 'none';
    document.getElementById('bid-3-btn').style.display = 'none';
    document.getElementById('no-bid-btn').style.display = 'none';
    
    // 显示操作按钮
    const isMyTurn = state.currentPlayer === state.myUserId;
    document.getElementById('pass-btn').style.display = isMyTurn ? 'inline-block' : 'none';
    document.getElementById('play-btn').style.display = isMyTurn ? 'inline-block' : 'none';
    
    // 渲染玩家信息
    this.renderPlayers(state);
    
    // 渲染底牌
    if (state.landlordCards && state.landlordCards.length > 0) {
      const container = document.getElementById('landlord-cards');
      container.innerHTML = '';
      state.landlordCards.forEach(card => {
        container.appendChild(Cards.createCard(card));
      });
    }
    
    // 渲染最后一手牌
    if (state.lastPlay) {
      const container = document.getElementById('last-play');
      container.innerHTML = '';
      state.lastPlay.cards.forEach(card => {
        const cardEl = Cards.createCard(card);
        cardEl.classList.add('playing');
        container.appendChild(cardEl);
      });
    }
    
    // 渲染我的手牌
    if (state.myHand && state.myHand.length > 0) {
      const container = document.getElementById('my-hand');
      Cards.renderHand(container, state.myHand, true);
    }
    
    this.showMessage(isMyTurn ? '轮到你出牌' : '等待其他玩家...');
  },
  
  // 渲染玩家
  renderPlayers(state) {
    state.players.forEach((player, index) => {
      const position = index === 0 ? 'right' : (index === 1 ? 'top' : 'left');
      const nameEl = document.getElementById(`${position}-player-name`);
      const cardsEl = document.getElementById(`${position}-player-cards`);
      
      if (nameEl) nameEl.textContent = `@${player.username || player.id}`;
      if (cardsEl) cardsEl.textContent = `${player.cards}张`;
    });
  },
  
  // 显示结算
  showResult(state) {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'flex';
    
    const title = document.getElementById('result-title');
    const details = document.getElementById('result-details');
    
    if (state.winner === state.myUserId) {
      title.textContent = '🎉 你赢了！';
      title.style.color = '#11998e';
    } else {
      title.textContent = '😅 你输了';
      title.style.color = '#d40000';
    }
    
    details.innerHTML = `
      <p>🏆 赢家：@${state.winnerName}</p>
      <p>💰 积分变化：${state.scoreChange > 0 ? '+' : ''}${state.scoreChange}分</p>
      <p>📊 当前积分：${state.myScore}分</p>
    `;
  },
  
  // 显示消息
  showMessage(msg) {
    const el = document.getElementById('game-message');
    if (el) {
      el.textContent = msg;
      el.style.animation = 'none';
      el.offsetHeight; // 触发重绘
      el.style.animation = 'fadeIn 0.3s';
    }
  }
};

// 辅助函数
function showLoading() {
  document.getElementById('loading-screen').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading-screen').style.display = 'none';
}
