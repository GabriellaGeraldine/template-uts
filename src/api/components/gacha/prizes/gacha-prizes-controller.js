const prizesService = require('./gacha-prizes-service');
const gachaUsersService = require('../users/gacha-users-service');
const { errorResponder, errorTypes } = require('../../../../core/errors');

async function playGacha(request, response, next) {
  try {
    const { userId } = request.body;

    // 1. Ambil data User & Cek Limit 5x
    const user = await gachaUsersService.getGachaUser(userId);
    if (!user) {
      return next(errorResponder(errorTypes.NOT_FOUND, 'User tidak ditemukan'));
    }

    const countToday = await gachaUsersService.checkLimit(user.email);
    if (countToday >= 5) {
      return next(errorResponder(errorTypes.FORBIDDEN, 'Limit 5x per hari'));
    }
    // 2. Ambil & Filter Hadiah (Anti-Minus)
    const prizes = await prizesService.getPrizes();
    const availablePrizes = prizes.filter(
      (p) => (p.kuotaTotal || 0) - (p.kuotaTerpakai || 0) > 0
    );

    if (availablePrizes.length === 0) {
      return next(
        errorResponder(errorTypes.NOT_FOUND, 'Maaf, hadiah telah habis')
      );
    }
    // 3. Kocok Hadiah
    const wonPrize =
      availablePrizes[Math.floor(Math.random() * availablePrizes.length)];

    // 4. Update Stok & Simpan History
    const { _id: prizeId, nama: prizeName } = wonPrize;
    const { email: userEmail, fullName: userFullName } = user;

    await prizesService.updateKuota(prizeId);
    const history = await gachaUsersService.saveRoll({
      userEmail,
      userNama: userFullName,
      prizeNama: prizeName,
      status: prizeName.toLowerCase().includes('kurang beruntung')
        ? 'lose'
        : 'win',
    });

    return response.status(200).json({ success: true, data: history });
  } catch (error) {
    return next(error);
  }
}

// async function playGacha(request, response, next) {
//   try {
//     const { userId } = request.body;
//     const prizes = await prizesService.getPrizes();

//     const availablePrizes = prizes.filter((p) => {
//       const keluar = p.kuota_keluar || 0;
//       return keluar < p.kuota;
//     });

//     if (availablePrizes.length === 0) {
//       return next(
//         errorResponder(errorTypes.NOT_FOUND, 'Maaf, hadiah sudah habis')
//       );
//     }

//     const randomIndex = Math.floor(Math.random() * availablePrizes.length);
//     const wonPrize = availablePrizes[randomIndex];

//     const { _id: prizeId, nama: prizeName, kuota, kuotaKeluar } = wonPrize;

//     await prizesService.updateKuota(prizeId);

//     if (userId) {
//       await gachaUsersRepository.addGachaHistory(userId, prizeName);
//     }

//     return response.status(200).json({
//       success: true,
//       message: 'Gacha SUKSES',
//       data: {
//         id: prizeId,
//         nama: prizeName,
//         remainingKuota: kuota - ((kuotaKeluar || 0) + 1),
//       },
//     });
//   } catch (error) {
//     return next(error);
//   }
// }

async function getPrizesStatus(request, response, next) {
  try {
    const prizes = await prizesService.getPrizes();

    const data = prizes.map((p) => ({
      nama: p.nama,
      kuotaTotal: p.kuota,
      kuotaTerpakai: p.kuotaKeluar || 0,
      sisaKuota: p.kuota - (p.kuotaKeluar || 0),
    }));

    return response.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

async function getAllGachaHistory(request, response, next) {
  try {
    // Kita panggil service user/history karena datanya ada di sana
    const history = await gachaUsersService.getAllHistory();
    return response.status(200).json(history);
  } catch (error) {
    return next(error);
  }
}

// 2. Ambil riwayat email tertentu (untuk profil user)
async function getHistoryByEmail(request, response, next) {
  try {
    const { email } = request.params;
    const history = await gachaUsersService.getHistoryByEmail(email);
    return response.status(200).json(history);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  playGacha,
  getPrizesStatus,
  getAllGachaHistory,
  getHistoryByEmail,
};
