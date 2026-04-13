// 战绩和排行榜 UI 管理
const HistoryUI = {
  // 显示战绩页面
  showHistory() {
    HistoryManager.load();
    const stats = HistoryManager.getStats();
    
    const html = `
      <div class="container" style="padding:20px;">
        <h1 style="margin-bottom:20px;">📊 我的战绩</h1>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">总对局</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.wins}</div>
            <div class="stat-label">胜利</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.losses}</div>
            <div class="stat-label">失败</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color:#ffd700;">${stats.winRate}%</div>
            <div class="stat-label">胜率</div>
          </div>
        </div>
        
        <div class="section">
          <h2 style="margin:20px 0 10px;">🎯 详细统计</h2>
          <div class="detail-row">
            <span>地主胜利：</span>
            <span style="color:#4facfe;">${stats.landlordWins} 局</span>
          </div>
          <div class="detail-row">
            <span>农民胜利：</span>
            <span style="color:#f093fb;">${stats.farmerWins} 局</span>
          </div>
        </div>
        
        <div class="section">
          <h2 style="margin:20px 0 10px;">📜 最近对局</h2>
          ${this.renderRecentGames()}
        </div>
        
        <button class="btn btn-secondary" onclick="HistoryUI.backToLobby()" style="margin-top:20px;">
          🏠 返回大厅
        </button>
      </div>
    `;
    
    document.getElementById('app').innerHTML = html;
  },
  
  // 渲染最近对局
  renderRecentGames() {
    const games = HistoryManager.games.slice(0, 10);
    if (games.length === 0) {
      return '<div style="text-align:center;color:rgba(255,255,255,0.6);padding:20px;">暂无对局记录</div>';
    }
    
    return games.map(game => {
      const date = new Date(game.date);
      const timeStr = `${date.getMonth()+1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}`;
      const winIcon = game.win ? '🎉' : '😢';
      const winText = game.win ? '胜利' : '失败';
      const scoreChange = game.win ? `+${game.scoreChange}` : `-${game.scoreChange}`;
      const role = game.isLandlord ? '地主' : '农民';
      
      return `
        <div class="game-record ${game.win ? 'win' : 'lose'}">
          <div class="record-left">
            <div class="record-result">${winIcon} ${winText}</div>
            <div class="record-role">${role}</div>
          </div>
          <div class="record-right">
            <div class="record-score">${scoreChange}</div>
            <div class="record-time">${timeStr}</div>
          </div>
        </div>
      `;
    }).join('');
  },
  
  // 显示排行榜页面
  showLeaderboard() {
    const leaderboard = LeaderboardManager.getLeaderboard();
    const userScore = window.state?.score || 100;
    const userRank = LeaderboardManager.getUserRank(userScore);
    
    const html = `
      <div class="container" style="padding:20px;">
        <h1 style="margin-bottom:20px;">🏆 排行榜</h1>
        
        <div class="my-rank">
          <div class="my-rank-title">我的排名</div>
          <div class="my-rank-value">第 ${userRank} 名</div>
          <div class="my-rank-score">${userScore} 分</div>
        </div>
        
        <div class="leaderboard-list">
          ${leaderboard.map((player, index) => {
            const rankClass = index < 3 ? `rank-${index+1}` : '';
            const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index+1}`;
            return `
              <div class="leaderboard-item ${rankClass}">
                <div class="lb-rank">${rankIcon}</div>
                <div class="lb-info">
                  <div class="lb-username">${player.username}</div>
                  <div class="lb-games">${player.games} 局</div>
                </div>
                <div class="lb-score">${player.score}</div>
              </div>
            `;
          }).join('')}
        </div>
        
        <button class="btn btn-secondary" onclick="HistoryUI.backToLobby()" style="margin-top:20px;">
          🏠 返回大厅
        </button>
      </div>
    `;
    
    document.getElementById('app').innerHTML = html;
  },
  
  // 返回大厅
  backToLobby() {
    if (window.showLobby) {
      window.showLobby();
    }
  }
};
