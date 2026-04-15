const { hashPassword } = require('../../../../utils/password');
const gachaUsersRepository = require('./gacha-users-repository');

async function getGachaUsers() {
  return gachaUsersRepository.getGachaUsers();
}

async function getGachaUser(id) {
  return gachaUsersRepository.getGachaUser(id);
}

async function emailExists(email) {
  const users = await gachaUsersRepository.getGachaUsersByEmail(email);
  return !!users;
}

async function createGachaUsers(email, password, fullName) {
  const hashedPassword = await hashPassword(password);
  return gachaUsersRepository.createGachaUsers(email, hashedPassword, fullName);
}

async function updateGachaUsers(id, email, fullName) {
  return gachaUsersRepository.updateGachaUsers(id, email, fullName);
}

async function deleteGachaUsers(id) {
  return gachaUsersRepository.deleteGachaUsers(id);
}

async function changePassword(id, password) {
  const hashedPassword = await hashPassword(password);
  return gachaUsersRepository.changePassword(id, hashedPassword);
}

async function checkLimit(email) {
  return gachaUsersRepository.countGachaToday(email);
}

async function saveRoll(data) {
  return gachaUsersRepository.createGachaHistory(data);
}

async function getHistory(email) {
  return gachaUsersRepository.getHistory(email);
}

async function getAllHistory() {
  return gachaUsersRepository.getAllHistory();
}

module.exports = {
  getGachaUsers,
  getGachaUser,
  emailExists,
  createGachaUsers,
  updateGachaUsers,
  deleteGachaUsers,
  changePassword,
  checkLimit,
  saveRoll,
  getHistory,
  getAllHistory,
};
