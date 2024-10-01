const users = [];

export const addUser = (user) => {
    users.push(user);
};

export const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

export const getUser = (socketId) => {
    return users.find((user) => user.socketId === socketId);
};

export const getUsers = () => {
    return users;
};

