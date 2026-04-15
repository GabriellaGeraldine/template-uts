const express = require('express');

const gachaUsersController = require('./gacha-users-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/', route);

  route.get('/', gachaUsersController.getGachaUsers);

  route.post('/', gachaUsersController.createGachaUser);

  route.post(':id/roll', gachaUsersController.rollGacha);

  route.get('/:id/history', gachaUsersController.getHistory);

  route.get('/:id', gachaUsersController.getGachaUsers);

  route.put('/:id', gachaUsersController.updateGachaUsers);

  route.put('/:id/change-password', gachaUsersController.changePassword);

  route.delete('/:id', gachaUsersController.deleteGachaUsers);
};
