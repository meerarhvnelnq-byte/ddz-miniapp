// 牌型判断工具
const CardUtils = {
  // 牌面值映射
  CARD_VALUES: {
    '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15,
    '小王': 16, '大王': 17
  },
  
  // 获取牌面值
  getCardValue(card) {
    return this.CARD_VALUES[card.value] || 0;
  },
  
  // 检查牌型
  checkCardType(cards) {
    if (!cards || cards.length === 0) return { type: null, value: 0 };
    
    const count = cards.length;
    const values = cards.map(c => this.getCardValue(c)).sort((a, b) => a - b);
    
    // 单张
    if (count === 1) {
      return { type: 'single', value: values[0] };
    }
    
    // 对子
    if (count === 2 && values[0] === values[1]) {
      return { type: 'pair', value: values[0] };
    }
    
    // 三张
    if (count === 3 && values[0] === values[1] && values[1] === values[2]) {
      return { type: 'triple', value: values[0] };
    }
    
    // 三带一
    if (count === 4) {
      if (values[0] === values[1] && values[1] === values[2]) {
        return { type: 'triple_one', value: values[0] };
      }
      if (values[1] === values[2] && values[2] === values[3]) {
        return { type: 'triple_one', value: values[1] };
      }
    }
    
    // 三带二
    if (count === 5) {
      if (values[0] === values[1] && values[1] === values[2]) {
        return { type: 'triple_two', value: values[0] };
      }
      if (values[2] === values[3] && values[3] === values[4]) {
        return { type: 'triple_two', value: values[2] };
      }
    }
    
    // 炸弹
    if (count === 4 && values[0] === values[1] && values[1] === values[2] && values[2] === values[3]) {
      return { type: 'bomb', value: values[0] };
    }
    
    // 王炸
    if (count === 2 && cards.some(c => c.value === '大王') && cards.some(c => c.value === '小王')) {
      return { type: 'rocket', value: 999 };
    }
    
    // 顺子（至少 5 张连续）
    if (count >= 5) {
      const isConsecutive = values.every((v, i) => i === 0 || v === values[i-1] + 1);
      if (isConsecutive && values[values.length - 1] < 15) { // 2 不能参与顺子
        return { type: 'straight', value: values[values.length - 1] };
      }
    }
    
    // 连对（至少 3 对连续）
    if (count >= 6 && count % 2 === 0) {
      const pairValues = [];
      let isConsecutivePairs = true;
      for (let i = 0; i < count; i += 2) {
        if (values[i] === values[i+1]) {
          pairValues.push(values[i]);
        } else {
          isConsecutivePairs = false;
          break;
        }
      }
      if (isConsecutivePairs && pairValues.length >= 3) {
        const isConsecutive = pairValues.every((v, i) => i === 0 || v === pairValues[i-1] + 1);
        if (isConsecutive && pairValues[pairValues.length - 1] < 15) {
          return { type: 'consecutive_pairs', value: pairValues[pairValues.length - 1] };
        }
      }
    }
    
    // 飞机（连续的三张）
    const tripleValues = [];
    let i = 0;
    while (i < count - 2) {
      if (values[i] === values[i+1] && values[i+1] === values[i+2]) {
        tripleValues.push(values[i]);
        i += 3;
      } else {
        i++;
      }
    }
    
    if (tripleValues.length >= 2) {
      const isConsecutive = tripleValues.every((v, i) => i === 0 || v === tripleValues[i-1] + 1);
      if (isConsecutive && tripleValues[tripleValues.length - 1] < 15) {
        const tripleCount = tripleValues.length;
        // 纯飞机
        if (count === tripleCount * 3) {
          return { type: 'aircraft', value: tripleValues[tripleValues.length - 1] };
        }
        // 飞机带单
        if (count === tripleCount * 4) {
          return { type: 'aircraft_single', value: tripleValues[tripleValues.length - 1] };
        }
        // 飞机带对
        if (count === tripleCount * 5) {
          return { type: 'aircraft_pair', value: tripleValues[tripleValues.length - 1] };
        }
      }
    }
    
    return { type: null, value: 0 };
  },
  
  // 检查是否可以出牌
  canPlay(cards, lastCards) {
    if (!lastCards || lastCards.length === 0) return true;
    
    const current = this.checkCardType(cards);
    const last = this.checkCardType(lastCards);
    
    if (!current.type) return false;
    
    // 王炸最大
    if (current.type === 'rocket') return true;
    
    // 炸弹可以打非炸弹
    if (current.type === 'bomb' && last.type !== 'rocket') {
      if (last.type !== 'bomb' || current.value > last.value) {
        return true;
      }
    }
    
    // 同牌型比较
    if (current.type === last.type) {
      if (cards.length === lastCards.length) {
        return current.value > last.value;
      }
    }
    
    return false;
  },
  
  // 获取牌型名称
  getCardTypeName(type) {
    const names = {
      'single': '单张',
      'pair': '对子',
      'triple': '三张',
      'triple_one': '三带一',
      'triple_two': '三带二',
      'bomb': '炸弹',
      'rocket': '王炸',
      'straight': '顺子',
      'consecutive_pairs': '连对',
      'aircraft': '飞机',
      'aircraft_single': '飞机带单',
      'aircraft_pair': '飞机带对'
    };
    return names[type] || '未知';
  }
};

// 战绩管理
const HistoryManager = {
  games: [],
  
  // 添加对局记录
  addGame(result) {
    this.games.unshift({
      date: new Date().toISOString(),
      ...result
    });
    // 只保留最近 100 局
    if (this.games.length > 100) {
      this.games.pop();
    }
    this.save();
  },
  
  // 获取统计数据
  getStats() {
    const total = this.games.length;
    const wins = this.games.filter(g => g.win).length;
    const losses = total - wins;
    const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : 0;
    
    // 计算地主胜/农民胜
    const landlordGames = this.games.filter(g => g.isLandlord !== undefined);
    const landlordWins = landlordGames.filter(g => g.isLandlord && g.win).length;
    const farmerWins = landlordGames.filter(g => !g.isLandlord && g.win).length;
    
    return {
      total,
      wins,
      losses,
      winRate,
      landlordWins,
      farmerWins
    };
  },
  
  // 保存到 localStorage
  save() {
    try {
      localStorage.setItem('ddz_history', JSON.stringify(this.games));
    } catch (e) {
      console.warn('保存战绩失败:', e);
    }
  },
  
  // 从 localStorage 加载
  load() {
    try {
      const saved = localStorage.getItem('ddz_history');
      if (saved) {
        this.games = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('加载战绩失败:', e);
    }
  }
};

// 排行榜管理
const LeaderboardManager = {
  // 模拟排行榜数据
  getLeaderboard() {
    // 实际应该从服务器获取
    return [
      { rank: 1, username: '牌神', score: 5280, games: 328 },
      { rank: 2, username: '斗地主王', score: 4950, games: 412 },
      { rank: 3, username: '幸运儿', score: 4620, games: 256 },
      { rank: 4, username: '策略大师', score: 4380, games: 389 },
      { rank: 5, username: '炸弹王', score: 4150, games: 301 },
      { rank: 6, username: '顺子王', score: 3920, games: 278 },
      { rank: 7, username: '地主专业户', score: 3680, games: 345 },
      { rank: 8, username: '农民翻身', score: 3450, games: 267 },
      { rank: 9, username: '稳扎稳打', score: 3220, games: 234 },
      { rank: 10, username: '新手运气', score: 2980, games: 156 }
    ];
  },
  
  // 获取当前用户排名
  getUserRank(score) {
    const leaderboard = this.getLeaderboard();
    const rank = leaderboard.findIndex(p => p.score <= score) + 1;
    return rank || leaderboard.length + 1;
  }
};
