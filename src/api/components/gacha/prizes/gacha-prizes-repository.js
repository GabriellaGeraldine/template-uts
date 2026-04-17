const { Prizes } = require('../../../../models');

async function getPrizes() {
  return Prizes.find({});
}

async function updateKuota(id) {
  return Prizes.findByIdAndUpdate(
    id,
    { $inc: { kuotaKeluar: 1 } },
    { new: true }
  );
}
module.exports = {
  getPrizes,
  updateKuota,
};
