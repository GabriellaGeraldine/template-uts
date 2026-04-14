const { hashPassword } = require('../../../utils/password');
const gachaClientsRepository = require('./gacha-clienyts-repository');

async function getClients() {
  return gachaClientsRepository.getClients();
}

async function getClient(id) {
  return gachaClientsRepository.getClient(id);
}

async function emailExists(email) {
  const clients = await gachaClientsRepository.getClientsByEmail(email);
  return !!clients; // Return true if user exists, false otherwise
}

async function createClients(email, password, fullName) {
  return gachaClientsRepository.createClients(email, password, fullName);
}

async function updateCLients(id, email, fullName) {
  return gachaClientsRepository.updateClients(id, email, fullName);
}

async function deleteClients(id) {
  return gachaClientsRepository.deleteClients(id);
}

async function changePassword(id, password) {
  return gachaClientsRepository.changePassword(id, hashPassword)
}

async function getPrizes(params) {
  
}

async function rollGacha(params) {
  
}

async function getHistory() {
  return gachaClientsRepository.getHistory(fullName, description)
}

module.exports = {
  getClients,
  getClient,
  emailExists,
  createClients,
  updateClients,
  deleteClients,
  changePassword
};
