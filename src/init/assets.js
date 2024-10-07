import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 최상위 경로 + assets 폴더
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basePath = path.join(__dirname, '../../public/assets');
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
