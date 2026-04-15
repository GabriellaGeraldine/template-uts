const mongoose = require('mongoose');
const gachaUsersSchema = require('../../../../models/gacha-users-schema');
const gachaHistorySchema = require('../../../../models/gacha-history-schema');

const GachaUser = gachaUsersSchema(mongoose);
const GachaHistory = gachaHistorySchema(mongoose);

async function getGachaUsers() {
  return GachaUser.find({});
}

async function getGachaUser(id) {
  return GachaUser.findById(id);
}

async function getGachaUserByEmail(email) {
  return GachaUser.findOne({ email });
}

async function createGachaUser(email, password, fullName) {
  return GachaUser.create({ email, password, fullName });
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

async function countGachaToday(email) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return GachaHistory.countDocuments({
    userEmail: email,
    createdAt: { $gte: startOfDay },
  });
}

async function updateGachaUser(id, email, fullName) {
  return GachaUser.updateOne({ _id: id }, { $set: { email, fullName } });
}

async function changePassword(id, password) {
  return GachaUser.updateOne({ _id: id }, { $set: { password } });
}

async function deleteGachaUser(id) {
  return GachaUser.deleteOne({ _id: id });
}

module.exports = {
  getGachaUsers,
  getGachaUser,
  getGachaUserByEmail,
  createGachaUser,
  createGachaHistory,
  getHistoryByEmail,
  countGachaToday,
  updateGachaUser,
  changePassword,
  deleteGachaUser,
};
