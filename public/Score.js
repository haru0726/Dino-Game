import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  scoreIncrement = 0;
  HIGH_SCORE_KEY = 'highScore';
  currentStage = 1000; // 현재 스테이지 ID
  stageChanged = {}; // 스테이지 변경 확인용 플래그

  constructor(ctx, scaleRatio, stageTable, itemTable, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageTable = stageTable;
    this.itemTable = itemTable;
    this.itemController = itemController;

    // 모든 스테이지에 대해 stageChanged 초기화
    this.stageTable.forEach((stage) => {
      this.stageChanged[stage.id] = false;
    });
  }

  update(deltaTime) {
    const currentStageInfo = this.stageTable.find((stage) => stage.id === this.currentStage);
    const scorePerSecond = currentStageInfo ? currentStageInfo.scorePerSecond : 1;

    // 증가분을 누적
    this.scoreIncrement += deltaTime * 0.001 * scorePerSecond;

    // 증가분이 scorePerSecond 만큼 쌓이면 score에 반영하고 초기화
    if (this.scoreIncrement >= scorePerSecond) {
      this.score += scorePerSecond;
      this.scoreIncrement -= scorePerSecond;
    }

    this.checkStageChange();
  }

  checkStageChange() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];

      if (
        Math.floor(this.score) >= stage.score &&
        !this.stageChanged[stage.id] &&
        stage.id !== 1000
      ) {
        const previousStage = this.currentStage;
        this.currentStage = stage.id;

        this.stageChanged[stage.id] = true;
        sendEvent(11, { currentStage: previousStage, targetStage: this.currentStage });

        if (this.itemController) {
          this.itemController.setCurrentStage(this.currentStage);
        }

        this.showStageChangeNotification(previousStage, this.currentStage);
        break;
      }
    }
  }

  showStageChangeNotification(previousStage, currentStage) {
    const notification = document.createElement('div');
    notification.className = 'stage-notification';
    notification.innerText = `스테이지가 ${previousStage - 999}에서 ${currentStage - 999}로 변경되었습니다!`;
    document.body.appendChild(notification);

    // 애니메이션 효과 추가
    setTimeout(() => {
      notification.classList.add('show'); // 표시
    }, 100); // 짧은 지연 후 표시

    // 3초 후 사라지게
    setTimeout(() => {
      notification.classList.remove('show'); // 숨기기
    }, 3000); // 3초 후

    setTimeout(() => {
      document.body.removeChild(notification); // 완전히 제거
    }, 3500); // 3.5초 후 완전히 제거
  }

  getItem(itemId) {
    const itemInfo = this.itemTable.find((item) => item.id === itemId);
    if (itemInfo) {
      this.score += itemInfo.score;
      sendEvent(21, { itemId, timestamp: Date.now() });
    }
  }

  reset() {
    this.score = 0;
    this.scoreIncrement = 0;
    this.currentStage = 1000; // 스테이지 초기화

    Object.keys(this.stageChanged).forEach((key) => {
      this.stageChanged[key] = false;
    });

    if (this.itemController) {
      this.itemController.setCurrentStage(this.currentStage);
    }
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    this.drawStage();
  }

  drawStage() {
    const stageY = 20 * this.scaleRatio;
    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `bold ${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const stageText = `Stage ${this.currentStage - 999}`;
    const stageX = 20 * this.scaleRatio;

    this.ctx.fillText(stageText, stageX, stageY);
  }
}


export default Score;
