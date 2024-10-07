import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 최상위 경로 + assets 폴더
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../public/assets');
const highScoreFilePath = path.join(__dirname, 'highscores.json'); // 최고 점수를 저장할 파일 경로
let gameAssets = {};

// 파일 읽는 함수
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// 모든 게임 자산을 비동기로 로드
export const loadGameAssets = async () => {
  try {
    const [stages, items, itemUnlocks] = await Promise.all([
      readFileAsync('stage.json'),
      readFileAsync('item.json'),
      readFileAsync('item_unlock.json'),
    ]);

    gameAssets = { stages, items, itemUnlocks };
    console.log('Game assets loaded successfully');
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

// 게임 자산을 가져오는 함수
export const getGameAssets = () => {
  return gameAssets;
};

// 최고 점수를 저장하고 가져오는 함수 (추가)
export const saveHighScore = (uuid, score) => {
  let highScoreData = {};

  // 파일에서 기존 점수 읽기
  if (fs.existsSync(highScoreFilePath)) {
    const data = fs.readFileSync(highScoreFilePath, 'utf8');
    highScoreData = JSON.parse(data);
  }

  if (!highScoreData[uuid] || score > highScoreData[uuid]) {
    highScoreData[uuid] = Math.floor(score);
    fs.writeFileSync(highScoreFilePath, JSON.stringify(highScoreData), 'utf8');
    console.log(`New high score for ${uuid}: ${score}`);
  }
};

export const getHighScore = (uuid) => {
  let highScoreData = {};

  if (fs.existsSync(highScoreFilePath)) {
    const data = fs.readFileSync(highScoreFilePath, 'utf8');
    highScoreData = JSON.parse(data);
  }

  return highScoreData[uuid] || 0; // 점수가 없으면 0 반환
};
