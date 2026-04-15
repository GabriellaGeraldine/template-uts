const { Users, GachaHistory } = require('../../../models');
const { updateUsers, deleteUsers } = require('./gacha-users-service');

async function getUsers() {
  return Users.find({});
}

async function getUser(id) {
  return Users.findById(id);
}

async function getUserByEmail(email) {
  return Users.findOne({ email });
}

async function createUser(email, password, fullName) {
  return Users.create({ email, password, fullName });
}

async function updateUser(id, email, fullName) {
  return Users.updateOne({ _id: id }, { $set: { email, fullName } });
}

async function changePassword(id, password) {
  return Users.updateOne({ _id: id }, { $set: { password } });
}

async function deleteUser(id) {
  return Users.deleteOne({ _id: id });
}

async function countGachaToday(email) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return GachaHistory.countDocuments({
    userEmail: email,
    createdAt: { $gte: startOfDay },
  });
}

async function createGachaHistory(data) {
  return GachaHistory.create({
    userEmail: data.userEmail,
    userName: data.userName,
    prizeName: data.prizeName,
    status: data.status,
  });
}

async function getHistoryByEmail(email) {
  return GachaHistory.find({ userEmail: email });
}

module.exports = {
  getUsers,
  getUser,
  getUserByEmail,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  countGachaToday,
  createGachaHistory,
  getHistoryByEmail,
};
