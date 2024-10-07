import { getStage, clearStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import calculateTotalScore from '../utils/calculateTotalScore.js';
import { getUserItems, initializeItems } from '../models/item.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 최상위 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const highScoreFilePath = path.join(__dirname, 'highscores.json'); // 최고 점수를 저장할 파일 경로

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);
  initializeItems(uuid);
  setStage(uuid, stages.data[0].id, payload.timestamp);

  return { status: 'success', handler: 2 };
};

// 최고 점수를 저장하는 함수
const setHighScore = (uuid, score) => {
  let highScoreData = {};

  // 파일에서 기존 점수 읽기
  if (fs.existsSync(highScoreFilePath)) {
    const data = fs.readFileSync(highScoreFilePath, 'utf8');
    highScoreData = JSON.parse(data);
  }

  const highScore = highScoreData[uuid] || 0;

  if (score > highScore) {
    highScoreData[uuid] = Math.floor(score);
    fs.writeFileSync(highScoreFilePath, JSON.stringify(highScoreData), 'utf8');
    console.log(`New high score for ${uuid}: ${score}`);
  }
};

// 최고 점수를 가져오는 함수
const getHighestScore = (uuid) => {
  let highScoreData = {};

  // 파일에서 기존 점수 읽기
  if (fs.existsSync(highScoreFilePath)) {
    const data = fs.readFileSync(highScoreFilePath, 'utf8');
    highScoreData = JSON.parse(data);
  }

  return highScoreData[uuid] || 0; // 점수가 없으면 0 반환
};

// 게임 종료 처리 함수
export const gameEnd = (uuid, payload) => {
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const userItems = getUserItems(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  const totalScore = calculateTotalScore(stages, gameEndTime, false, userItems);
  console.log(`Calculated total score: ${totalScore}, Client score: ${score}`);

  if (Math.abs(totalScore - score) > 10) {
    return { status: 'fail', message: 'Score verification failed' };
  }

  const highestScore = getHighestScore(uuid); // 최고 점수 가져오기
  let message = '게임 끝';

  if (totalScore > highestScore) {
    setHighScore(uuid, totalScore); // 최고 점수 업데이트
    message += ', 새로운 최고 점수 기록!';
  }

  return { status: 'END', message, score, handler: 3 };
};
