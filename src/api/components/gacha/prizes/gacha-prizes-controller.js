const prizesService = require('./gacha-prizes-service');
const gachaUsersRepository = require('../users/gacha-users-repository');
const errorResponder = require('../../../../core/errors');

async function playGacha(request, response, next) {
  try {
    const { userId } = request.body;
    const prizes = await prizesService.getPrizes();

    const availablePrizes = prizes.filter((p) => {
      const keluar = p.kuota_keluar || 0;
      return keluar < p.kuota;
    });

    if (availablePrizes.length === 0) {
      throw errorResponder(404, 'Maaf, hadiah sudah habis');
    }

    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    const wonPrize = availablePrizes[randomIndex];

    const { _id: prizeId, nama: prizeName, kuota, kuotaKeluar } = wonPrize;

    await prizesService.updateKuota(prizeId);

    if (userId) {
      await gachaUsersRepository.addGachaHistory(userId, prizeName);
    }

    return response.status(200).json({
      success: true,
      message: 'Gacha SUKSES',
      data: {
        id: prizeId,
        nama: wonPrize.nama,
        remainingKuota: kuota - ((wonPrize.kuota_keluar || 0) + 1),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  playGacha,
};
