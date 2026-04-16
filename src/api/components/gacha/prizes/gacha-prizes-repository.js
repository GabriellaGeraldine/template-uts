const { Prizes } = require('../../../../models');

async function getPrizes() {
  return Prizes.find({});
}

async function updateKuota(id) {
  const prize = await Prizes.findOne({ _id: id });

  if (prize) {
    const kuotaKeluarBaru = (prize.kuotaKeluar || 0) + 1;
    return Prizes.updateOne({ _id: id }, { $set: { kuota: kuotaKeluarBaru } });
  }
  return null;
}

module.exports = {
  getPrizes,
  updateKuota,
};
