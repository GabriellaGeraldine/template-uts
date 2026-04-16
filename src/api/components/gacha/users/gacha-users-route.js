const express = require('express');

const gachaUsersController = require('./gacha-users-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/api/gacha/users', route);

  route.get('/', gachaUsersController.getGachaUsers);

  route.get('/winners', gachaUsersController.getWinners);

  route.get('/all-history', gachaUsersController.getAllHistory);

  route.get('/history/:email', gachaUsersController.getHistory);

  route.get('/:id', gachaUsersController.getGachaUser);

  route.post('/', gachaUsersController.createGachaUser);

  route.post('/roll/:id', gachaUsersController.rollGacha);

  route.put('/:id', gachaUsersController.updateGachaUser);

  route.put('/:id/change-password', gachaUsersController.changePassword);

  route.delete('/:id', gachaUsersController.deleteGachaUser);
};
