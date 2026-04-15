const express = require('express');
const gachaPrizesController = require('./gacha-prizes-controller');

const router = express.Router();

module.exports = (app) => {
  app.use('gacha/prizes', router);

  router.post('/roll', gachaPrizesController.playGacha);

  router.get('/status', gachaPrizesController.getPrizesStatus);
};
