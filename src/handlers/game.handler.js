import { getStage, clearStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import calculateTotalScore from '../utils/calculateTotalScore.js';
import { getUserItems, initializeItems } from '../models/item.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);
  initializeItems(uuid);
  setStage(uuid, stages.data[0].id, payload.timestamp);

  return { status: 'success', handler: 2 };
};

const getHighestScore = (uuid) => {
    return 982; 
  };
  
  // 최고 점수를 업데이트하는 함수
  const updateHighestScore = (uuid, newScore) => {

  };
  
  // 게임 종료 처리 함수
  export const gameEnd = (uuid, payload) => {
    const { timestamp: gameEndTime, score } = payload;
    const stages = getStage(uuid);
    const userItems = getUserItems(uuid);
  
    if (!stages.length) {
      return { status: 'fail', message: 'No stages found for user' };
    }
  
    // 총 점수 계산
    const totalScore = calculateTotalScore(stages, gameEndTime, false, userItems);
    console.log(`Calculated total score: ${totalScore}, Client score: ${score}`);
  
    // 점수와 타임스탬프 검증
    if (Math.abs(totalScore - score) > 10) { // 정밀도를 높임
      return { status: 'fail', message: 'Score verification failed' };
    }
  
    // 최고 점수 확인 및 저장
    const highestScore = getHighestScore(uuid); // 최고 점수 가져오기
    let message = '게임 끝';
  
    if (totalScore > highestScore) {
      updateHighestScore(uuid, totalScore); // 최고 점수 업데이트
      message += ', 새로운 최고 점수 기록!';
    }
  
    return { status: 'END', message, score, handler: 3 };
  };
  
  