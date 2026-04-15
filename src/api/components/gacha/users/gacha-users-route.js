const express = require('express');

const gachaUsers = require('./gacha-users-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/', route);

  route.get('/', gachaUsersController.getUsers);

  route.post('/', gachaUsersController.createUser);  

  route.get('/prizes', gachaPrizesController.getPrizes);

  route.post(':id/roll', gachaUsersController.rollGacha);

  route.get('/:id/history', gachaUsersController.getHistory)

  route.get('/:id', gachaUsersController.getUsers);

  route.put('/:id', gachaUsersController.updateUsers);

  route.put('/:id/change-password', gachaUsersController.changePassword);

  route.delete('/:id', gachaUsersController.deleteUsers);
};