const models = require('../../../../models');

const GachaUser = models.gachaUsers;

const GachaHistory = models.gachaHistory;

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

async function updateGachaUser(id, email, fullName) {
  return GachaUser.updateOne({ _id: id }, { $set: { email, fullName } });
}

async function changePassword(id, password) {
  return GachaUser.updateOne({ _id: id }, { $set: { password } });
}

async function deleteGachaUser(id) {
  return GachaUser.deleteOne({ _id: id });
}

async function getHistoryByEmail(email) {
  return GachaHistory.find({ userEmail: email }).sort({ createdAt: -1 });
}

async function getAllHistory() {
  return GachaHistory.find({}).sort({ createdAt: -1 });
}

async function countHistoryToday(email) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return GachaHistory.countDocuments({
    userEmail: email,
    createdAt: { $gte: startOfDay },
  });
}

async function saveRoll(data) {
  return GachaHistory.create(data);
}

module.exports = {
  getGachaUsers,
  getGachaUser,
  getGachaUserByEmail,
  createGachaUser,
  updateGachaUser,
  changePassword,
  deleteGachaUser,
  getHistoryByEmail,
  getAllHistory,
  countHistoryToday,
  saveRoll,
};
