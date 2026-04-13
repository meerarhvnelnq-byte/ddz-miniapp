// 动画管理
const AnimationManager = {
  // 创建出牌动画
  playCardAnimation(cardEl, targetEl) {
    if (!cardEl || !targetEl) return;
    
    const rect = cardEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    
    // 创建动画克隆
    const clone = cardEl.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.left = rect.left + 'px';
    clone.style.top = rect.top + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.zIndex = '9999';
    clone.style.transition = 'all 0.5s ease-in-out';
    document.body.appendChild(clone);
    
    // 动画到目标位置
    setTimeout(() => {
      clone.style.transform = `translate(${targetRect.left - rect.left}px, ${targetRect.top - rect.top}px) scale(0.5)`;
      clone.style.opacity = '0.5';
    }, 10);
    
    // 清理
    setTimeout(() => {
      clone.remove();
    }, 500);
  },
  
  // 炸弹爆炸动画
  playBombAnimation(containerEl) {
    if (!containerEl) return;
    
    // 创建爆炸效果
    const explosion = document.createElement('div');
    explosion.style.position = 'absolute';
    explosion.style.top = '50%';
    explosion.style.left = '50%';
    explosion.style.transform = 'translate(-50%, -50%)';
    explosion.style.width = '200px';
    explosion.style.height = '200px';
    explosion.style.background = 'radial-gradient(circle, #ff6b6b 0%, #ff0000 50%, transparent 70%)';
    explosion.style.borderRadius = '50%';
    explosion.style.opacity = '0';
    explosion.style.zIndex = '9998';
    explosion.style.pointerEvents = 'none';
    containerEl.style.position = 'relative';
    containerEl.appendChild(explosion);
    
    // 爆炸动画
    const startTime = Date.now();
    const duration = 600;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const scale = 1 + progress * 2;
      const opacity = 1 - progress;
      
      explosion.style.transform = `translate(-50%, -50%) scale(${scale})`;
      explosion.style.opacity = opacity.toString();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        explosion.remove();
      }
    };
    
    requestAnimationFrame(animate);
    
    // 屏幕震动
    containerEl.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      containerEl.style.animation = '';
    }, 500);
  },
  
  // 王炸特效
  playRocketAnimation(containerEl) {
    if (!containerEl) return;
    
    // 创建多个爆炸圈
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playBombAnimation(containerEl);
      }, i * 150);
    }
    
    // 添加闪光
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.right = '0';
    flash.style.bottom = '0';
    flash.style.background = 'white';
    flash.style.opacity = '0.8';
    flash.style.zIndex = '9997';
    flash.style.pointerEvents = 'none';
    containerEl.style.position = 'relative';
    containerEl.appendChild(flash);
    
    setTimeout(() => {
      flash.style.transition = 'opacity 0.3s';
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 300);
    }, 50);
  },
  
  // 胜利彩带动画
  playConfetti(containerEl) {
    if (!containerEl) return;
    
    const colors = ['#ff6b6b', '#4facfe', '#00f2fe', '#f093fb', '#f5576c', '#ffd700'];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '10px';
      particle.style.height = '10px';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = '-10px';
      particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      particle.style.zIndex = '9996';
      particle.style.pointerEvents = 'none';
      containerEl.style.position = 'relative';
      containerEl.appendChild(particle);
      
      // 下落动画
      const duration = 2000 + Math.random() * 2000;
      const startX = Math.random() * 100;
      const endX = startX + (Math.random() - 0.5) * 100;
      
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const x = startX + (endX - startX) * progress;
        const y = progress * 100;
        const rotation = progress * 720;
        
        particle.style.transform = `translate(${x}%, ${y}%) rotate(${rotation}deg)`;
        particle.style.opacity = (1 - progress).toString();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      
      requestAnimationFrame(animate);
    }
  },
  
  // 发牌动画
  dealCardAnimation(cardEl, index, total) {
    if (!cardEl) return;
    
    cardEl.style.opacity = '0';
    cardEl.style.transform = 'translateY(-50px) scale(0.8)';
    cardEl.style.transition = 'all 0.3s ease-out';
    
    setTimeout(() => {
      cardEl.style.opacity = '1';
      cardEl.style.transform = 'translateY(0) scale(1)';
    }, index * 50);
  },
  
  // 倒计时进度条动画
  countdownAnimation(timerEl, timeLeft, totalTime) {
    if (!timerEl) return;
    
    const progress = timeLeft / totalTime;
    
    // 颜色变化
    if (progress < 0.3) {
      timerEl.style.background = 'rgba(255,87,87,0.5)';
      // 闪烁警告
      if (timeLeft <= 5) {
        timerEl.style.animation = 'pulse 0.5s infinite';
      }
    } else if (progress < 0.6) {
      timerEl.style.background = 'rgba(255,193,7,0.5)';
    } else {
      timerEl.style.background = 'rgba(79,172,254,0.5)';
    }
  },
  
  // 按钮点击动画
  buttonClickAnimation(btnEl) {
    if (!btnEl) return;
    
    btnEl.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btnEl.style.transform = 'scale(1)';
    }, 100);
  },
  
  // 牌选中动画
  cardSelectAnimation(cardEl, selected) {
    if (!cardEl) return;
    
    if (selected) {
      cardEl.style.transform = 'translateY(-15px)';
      cardEl.style.boxShadow = '0 5px 15px rgba(255,215,0,0.5)';
    } else {
      cardEl.style.transform = 'translateY(0)';
      cardEl.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    }
  },
  
  // 积分变化动画
  scoreChangeAnimation(scoreEl, change) {
    if (!scoreEl || change === 0) return;
    
    // 创建浮动数字
    const floatNum = document.createElement('div');
    floatNum.textContent = change > 0 ? `+${change}` : change.toString();
    floatNum.style.position = 'absolute';
    floatNum.style.fontSize = '24px';
    floatNum.style.fontWeight = 'bold';
    floatNum.style.color = change > 0 ? '#4facfe' : '#f5576c';
    floatNum.style.zIndex = '9999';
    floatNum.style.pointerEvents = 'none';
    floatNum.style.transition = 'all 0.8s ease-out';
    floatNum.style.opacity = '1';
    
    const rect = scoreEl.getBoundingClientRect();
    floatNum.style.left = rect.left + 'px';
    floatNum.style.top = rect.top + 'px';
    
    document.body.appendChild(floatNum);
    
    // 上浮动画
    setTimeout(() => {
      floatNum.style.transform = 'translateY(-50px)';
      floatNum.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      floatNum.remove();
    }, 800);
  }
};

// 添加 CSS 动画关键帧
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes pop {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`;
document.head.appendChild(style);
