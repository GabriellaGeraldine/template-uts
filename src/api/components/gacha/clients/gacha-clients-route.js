const express = require('express');

const gachaClients = require('./gacha-clients-controller');

const route = express.Router();

module.exports = (app) => {
  app.use('/', route);

  // Get list of clients
  route.get('/', gachaClientsController.getClients);

  // Create a new client
  route.post('/', gachaClientsController.createClient);
  
  //Get list of prizes
  route.get('/prizes', gachaPrizesController.getPrizes);

  //Clients roll gacha
  route.post(':id/roll', gachaClientsController.rollGacha);

  //Get clients history
  route.get('/:id/history', gachaClientsController.getHistory)

  // Get client detail
  route.get('/:id', gachaClientsController.getClients);

  // Update client
  route.put('/:id', gachaClientsController.updateClients);

  // Change password
  route.put('/:id/change-password', gachaClientsController.changePassword);

  // Delete client
  route.delete('/:id', gachaClientsController.deleteClients);
};