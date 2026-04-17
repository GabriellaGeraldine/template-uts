const prizesService = require('./gacha-prizes-service');
const gachaUsersService = require('../users/gacha-users-service');
const { errorResponder, errorTypes } = require('../../../../core/errors');

async function playGacha(request, response, next) {
  try {
    const { userId } = request.body;

    const user = await gachaUsersService.getGachaUser(userId);
    if (!user) {
      return next(errorResponder(errorTypes.NOT_FOUND, 'User tidak ditemukan'));
    }

    const countToday = await gachaUsersService.checkLimit(user.email);
    if (countToday >= 5) {
      return next(errorResponder(errorTypes.FORBIDDEN, 'Limit 5x per hari'));
    }
    const prizes = await prizesService.getPrizes();
    const availablePrizes = prizes.filter(
      (p) => (p.kuotaTotal || 0) - (p.kuotaTerpakai || 0) > 0
    );

    if (availablePrizes.length === 0) {
      return next(
        errorResponder(errorTypes.NOT_FOUND, 'Maaf, hadiah telah habis')
      );
    }
    const wonPrize =
      availablePrizes[Math.floor(Math.random() * availablePrizes.length)];

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

async function getPrizesStatus(request, response, next) {
  try {
    const prizes = await prizesService.getPrizes();

    const data = prizes.map((p) => ({
      nama: p.nama,
      kuotaTotal: p.kuotTotal,
      kuotaTerpakai: p.kuotaTerpakai || 0,
      sisaKuota: (p.kuotaTotal || 0) - (p.kuotaTerpakai || 0),
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
    const history = await gachaUsersService.getAllHistory();
    return response.status(200).json(history);
  } catch (error) {
    return next(error);
  }
}

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
