const express = require('express');

const gachaUsers = require('./gacha-users-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/gacha/users', route);

  route.get('/', gachaUsers.getGachaUsers);

  route.get('/winners', gachaUsers.getWinners);

  route.get('/all-history', gachaUsers.getAllHistory);

  route.get('/history/:email', gachaUsers.getHistory);

  route.get('/:id', gachaUsers.getGachaUser);

  route.post('/', gachaUsers.createGachaUser);

  route.post('/roll/:id', gachaUsers.rollGacha);

  route.put('/:id', gachaUsers.updateGachaUser);

  route.put('/:id/change-password', gachaUsers.changePassword);

  route.delete('/:id', gachaUsers.deleteGachaUser);
};
