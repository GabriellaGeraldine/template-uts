const { hashPassword } = require('../../../../utils/password');
const gachaUsersRepository = require('./gacha-users-repository');

async function getGachaUsers() {
  return gachaUsersRepository.getGachaUsers();
}

async function getGachaUser(id) {
  return gachaUsersRepository.getGachaUser(id);
}

async function emailExists(email) {
  const users = await gachaUsersRepository.getGachaUserByEmail(email);
  return !!users;
}

async function createGachaUser(email, password, fullName) {
  const hashedPassword = await hashPassword(password);
  return gachaUsersRepository.createGachaUser(email, hashedPassword, fullName);
}

async function updateGachaUser(id, email, fullName) {
  return gachaUsersRepository.updateGachaUser(id, email, fullName);
}

async function deleteGachaUser(id) {
  return gachaUsersRepository.deleteGachaUser(id);
}

async function changePassword(id, password) {
  const hashedPassword = await hashPassword(password);
  return gachaUsersRepository.changePassword(id, hashedPassword);
}

async function checkLimit(email) {
  return gachaUsersRepository.countHistoryToday(email);
}

async function getHistoryByEmail(email) {
  return gachaUsersRepository.getHistoryByEmail(email);
}

async function getAllHistory() {
  return gachaUsersRepository.getAllHistory();
}

async function saveRoll(data) {
  return gachaUsersRepository.saveRoll(data);
}

module.exports = {
  getGachaUsers,
  getGachaUser,
  emailExists,
  createGachaUser,
  updateGachaUser,
  deleteGachaUser,
  changePassword,
  checkLimit,
  getHistoryByEmail,
  getAllHistory,
  saveRoll,
};
