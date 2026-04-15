const { hashPassword } = require('../../../utils/password');
const gachaUsersRepository = require('./gacha-users-repository').default;

async function getUsers() {
  return gachaUsersRepository.getUsers();
}

async function getUser(id) {
  return gachaUsersRepository.getUser(id);
}

async function emailExists(email) {
  const users = await gachaUsersRepository.getUsersByEmail(email);
  return !!users;
}

async function createUsers(email, password, fullName) {
  return gachaUsersRepository.createUsers(email, password, fullName);
}

async function updateUsers(id, email, fullName) {
  return gachaUsersRepository.updateUsers(id, email, fullName);
}

async function deleteUsers(id) {
  return gachaUsersRepository.deleteUsers(id);
}

async function changePassword(id, password) {
  return gachaUsersRepository.changePassword(id, hashPassword);
}

async function getPrizes() {
  return gachaPrizesRepository.getPrizes();
}

async function checkLimit(email) {
  return gachaUsersRepository.countGachaToday(email);
}

async function saveRoll(data) {
  return gachaUsersRepository.createGachaHistory(data);
}

async function rollGacha(id) {}

async function getHistory() {
  return gachaUsersRepository.getHistory(fullName, description);
}

module.exports = {
  getUsers,
  getUser,
  emailExists,
  createUsers,
  updateUsers,
  deleteUsers,
  changePassword,
};
