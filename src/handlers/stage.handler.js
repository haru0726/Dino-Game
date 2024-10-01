import { getStage, setStage } from '../models/stage.model.js'; // 경로를 실제 위치에 맞게 조정
import { getGameAssets } from '../init/assets.js'; 

export const moveStageHandler = (userId, payload) => {
  // 유저의 현재 스테이지 정보 가져오기
  let currentStages = getStage(userId);
  
  // 현재 스테이지가 없는 경우
  if (!currentStages.length) {
    return { status: 'fail', message: "No stages found for user" };
  }

  // 오름차순으로 정렬하여 가장 큰 스테이지 id 확인
  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  // 클라이언트와 서버의 현재 스테이지 비교
  if (currentStage.id !== payload.currentStage) {
    return { status: "fail", message: "Current Stage mismatch" };
  }

  // 점수 검증을 위한 타임스탬프 확인
  const serverTime = Date.now(); // 현재 타임스탬프
  const elapsedTime = (serverTime - currentStage.timestamp) / 1000;

  // 1스테이지에서 2스테이지로 넘어가는 경우에 대한 검증
  // 30초가 경과해야 하며, 오차 범위를 두어 체크
  if (elapsedTime < 30 || elapsedTime > 105) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  // targetStage에 대한 검증 < 게임 에셋에 존재하는지 확인
  const { stages } = getGameAssets(); // stages 배열을 가져옴
  if (!Array.isArray(stages) || !stages.some(stage => stage.id === payload.targetStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }

  // 유저의 스테이지 업데이트
  setStage(userId, payload.targetStage, serverTime);
  
  return { status: 'success' };
};
