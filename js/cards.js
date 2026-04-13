// 牌面工具模块
const Cards = {
  // 牌面值
  values: ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', '小王', '大王'],
  
  // 花色
  suits: ['♠', '♥', '♣', '♦'],
  
  // 牌值映射
  valueMap: {
    '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15,
    '小王': 16, '大王': 17
  },
  
  // 创建牌面 HTML
  createCard(card, selectable = false) {
    const div = document.createElement('div');
    div.className = 'card';
    
    // 判断颜色
    const isRed = card.includes('♥') || card.includes('♦') || card === '大王';
    div.classList.add(isRed ? 'card-red' : 'card-black');
    
    // 特殊牌
    if (card === '小王') {
      div.classList.add('joker-small');
      div.innerHTML = '<span class="rank">小王</span>';
    } else if (card === '大王') {
      div.classList.add('joker-big');
      div.innerHTML = '<span class="rank">大王</span>';
    } else {
      // 普通牌
      const rank = card.replace(/[♠♥♣♦]/g, '');
      const suit = card.match(/[♠♥♣♦]/)?.[0] || '';
      
      div.innerHTML = `
        <span class="corner-rank">${rank}</span>
        <span class="rank">${rank}</span>
        <span class="suit">${suit}</span>
        <span class="corner-suit">${rank}</span>
      `;
    }
    
    if (selectable) {
      div.dataset.card = card;
      div.onclick = () => this.toggleSelect(div);
    }
    
    return div;
  },
  
  // 创建牌背
  createCardBack() {
    const div = document.createElement('div');
    div.className = 'card-back';
    return div;
  },
  
  // 切换选中
  toggleSelect(cardElement) {
    cardElement.classList.toggle('selected');
  },
  
  // 获取选中的牌
  getSelectedCards(handElement) {
    const selected = handElement.querySelectorAll('.card.selected');
    return Array.from(selected).map(el => el.dataset.card);
  },
  
  // 清除选中
  clearSelection(handElement) {
    const selected = handElement.querySelectorAll('.card.selected');
    selected.forEach(el => el.classList.remove('selected'));
  },
  
  // 渲染手牌
  renderHand(container, cards, selectable = false) {
    container.innerHTML = '';
    cards.forEach(card => {
      container.appendChild(this.createCard(card, selectable));
    });
  },
  
  // 渲染牌背（其他玩家）
  renderCardBacks(container, count) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      container.appendChild(this.createCardBack());
    }
  },
  
  // 解析牌面字符串
  parse(cardStr) {
    if (!cardStr) return [];
    
    // 王炸
    if (cardStr.includes('王炸')) {
      return ['小王', '大王'];
    }
    
    // 简单解析（空格分隔）
    return cardStr.trim().split(/\s+/).filter(c => c.length > 0);
  },
  
  // 牌型判断（简化版）
  checkType(cards) {
    if (!cards || cards.length === 0) return null;
    
    const count = cards.length;
    const values = cards.map(c => this.valueMap[c.replace(/[♠♥♣♦]/g, '')]).sort((a, b) => a - b);
    
    // 单张
    if (count === 1) {
      return { type: 'single', value: values[0] };
    }
    
    // 对子
    if (count === 2 && values[0] === values[1]) {
      return { type: 'pair', value: values[0] };
    }
    
    // 王炸
    if (count === 2 && values.includes(16) && values.includes(17)) {
      return { type: 'rocket', value: 17 };
    }
    
    // 炸弹
    if (count === 4 && values.every(v => v === values[0])) {
      return { type: 'bomb', value: values[0] };
    }
    
    // 顺子（简化）
    if (count >= 5 && count <= 12) {
      const isStraight = values.every((v, i) => i === 0 || v === values[i-1] + 1);
      if (isStraight && values[0] >= 3 && values[values.length-1] <= 14) {
        return { type: 'straight', value: values[values.length-1], count };
      }
    }
    
    return { type: 'unknown' };
  }
};
