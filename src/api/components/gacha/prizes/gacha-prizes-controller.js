const PrizeRepository = require('./gacha-prizes-repository');
const userRepository = require('../users/gacha-users-repository').default;

async function playGacha(request, response) {
  try {
    const { userId } = request.body;

    const prizes = await PrizeRepository.getPrizes();

    const availablePrizes = prizes.filter((p) => {
      const keluar = p.kuota_keluar || 0;
      return keluar < p.kuota;
    });

    if (availablePrizes.length === 0) {
      return response.status(404).json({
        message: 'Maaf, hadiah sudah habis!',
      });
    }

    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    const wonPrize = availablePrizes[randomIndex];

    if (!wonPrize) {
      return response
        .status(400)
        .json({ message: ' Gagal mendapatkan hadiah' });
    }

    const { _id: id, nama, kuota, kuota_keluar } = wonPrize;

    await PrizeRepository.updateKuota(id);

    if (userId) {
      await userRepository.addGachaHistory(userId, wonPrize.nama);
    }

    return response.status(200).json({
      success: true,
      message: 'Gacha SUKSES',
      data: {
        id,
        name: wonPrize.nama,
        remainingKuota: wonPrize.kuota - ((wonPrize.kuota_keluar || 0) + 1),
      },
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
}

module.exports = {
  playGacha,
};
