// 音效管理
const SoundManager = {
  enabled: true,
  audioContext: null,
  
  // 初始化
  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('音频上下文初始化失败:', e);
      this.enabled = false;
    }
  },
  
  // 播放合成音效
  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled || !this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  },
  
  // 出牌音效
  playCard() {
    this.playTone(600, 0.1, 'sine');
  },
  
  // 炸弹音效
  playBomb() {
    this.playTone(200, 0.3, 'square');
    setTimeout(() => this.playTone(150, 0.3, 'square'), 100);
  },
  
  // 王炸音效
  playRocket() {
    this.playTone(400, 0.2, 'square');
    setTimeout(() => this.playTone(300, 0.2, 'square'), 150);
    setTimeout(() => this.playTone(200, 0.4, 'square'), 300);
  },
  
  // 胜利音效
  playWin() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine'), i * 150);
    });
  },
  
  // 失败音效
  playLose() {
    const notes = [784, 659, 523];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine'), i * 200);
    });
  },
  
  // 叫分音效
  playBid() {
    this.playTone(800, 0.15, 'sine');
  },
  
  // 倒计时警告
  playWarning() {
    this.playTone(1000, 0.1, 'square');
  },
  
  // 签到音效
  playClaim() {
    const notes = [659, 784, 988];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, 'sine'), i * 100);
    });
  },
  
  // 按钮点击音效
  playClick() {
    this.playTone(1200, 0.05, 'sine');
  }
};
