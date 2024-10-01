import { getGameAssets } from '../init/assets.js';
import { getStage, setStage, clearStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
    const { stages } = getGameAssets();

    clearStage(uuid); // 스테이지 초기화
    setStage(uuid, stages.data[0].id, payload.timestamp); // 첫 번째 스테이지 설정
    console.log('Stage:', getStage(uuid));

    return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
    const { timestamp: gameEndTime, score } = payload;
    const stages = getStage(uuid);

    if (!stages.length) {
        return { status: "fail", message: "No stages found for user" };
    }

    let totalScore = 0;

    stages.forEach((stage, index) => {
        let stageEndTime;
        if (index === stages.length - 1) {
            stageEndTime = gameEndTime; // 마지막 스테이지는 게임 종료 시간을 사용
        } else {
            stageEndTime = stages[index + 1].timestamp; // 다음 스테이지의 타임스탬프
        }

        const stageDuration = (stageEndTime - stage.timestamp) / 1000; // 초 단위로 변환
        totalScore += stageDuration; // 1초당 1점
    });

    if (Math.abs(score - totalScore) > 5) {
        return { status: "fail", message: "Score verification failed" };
    }

    // 점수에 따라 스테이지 업데이트
    const { stages: allStages } = getGameAssets(); // 모든 스테이지 가져오기

    let nextStageId = allStages.data.find(stage => stage.score > totalScore)?.id; // 다음 스테이지 ID 찾기

    if (nextStageId) {
        setStage(uuid, nextStageId, gameEndTime); // 다음 스테이지로 전환
        console.log(`Stage updated to: ${nextStageId}`);
    }

    return { status: 'success', message: 'Game ended', score, nextStageId };
};
