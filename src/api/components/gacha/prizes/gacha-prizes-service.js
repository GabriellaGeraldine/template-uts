const prizesRepository = require('./gacha-prizes-repository');

async function getPrizes() {
  return prizesRepository.getPrizes();
}

async function updateKuota(id) {
  return prizesRepository.updateKuota(id);
}

module.exports = {
  getPrizes,
  updateKuota,
};
