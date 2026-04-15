const express = require('express');

const books = require('./components/books/books-route');
const users = require('./components/users/users-route');
const gachaPrizes = require('./components/gacha/prizes/gacha-prizes-route');
const gachaUsers = require('./components/gacha/users/gacha-users-route');

module.exports = () => {
  const app = express.Router();

  books(app);
  users(app);
  gachaPrizes(app);
  gachaUsers(app);

  return app;
};
