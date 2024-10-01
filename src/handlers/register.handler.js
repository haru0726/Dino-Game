import { v4 as uuidv4 } from 'uuid';
import { addUser, getUsers } from '../models/user.model.js'; // 사용자 목록 관련 함수들 불러오기
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

const createStage = (userUUID) => {
  console.log(`Stage created for user: ${userUUID}`);
};

const registerHandler = (io) => {
  io.on('connection', (socket) => {
    const userUUID = uuidv4(); // 새로운 UUID 생성
    addUser({ uuid: userUUID, socketId: socket.id }); // 사용자 추가

    createStage(userUUID); // 스테이지 생성

    handleConnection(socket, userUUID); // 연결 핸들러 호출

    // 연결된 모든 사용자 목록을 출력
    const currentUsers = getUsers();
    console.log(`Current users:`, currentUsers);

    socket.on('event', (data) => handlerEvent(io, socket, data));
    socket.on('disconnect', () => handleDisconnect(socket, userUUID));
  });
};

export default registerHandler;
