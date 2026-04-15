const mongoose = require('mongoose');
const gachaPrizeSchema = require('../../../../models/gacha-prizes-schema');

const Prize = gachaPrizeSchema(mongoose);

async function getPrizes() {
  return Prize.find({});
}

async function updateKuota(id) {
  const prize = await Prize.findOne({ _id: id });

  if (prize) {
    const kuotaKeluarBaru = (prize.kuota_keluar || 0) + 1;

    return Prize.updateOne({ _id: id }, { $set: { kuota: kuotaKeluarBaru } });
  }

  return null;
}

module.exports = {
  getPrizes,
  updateKuota,
};
