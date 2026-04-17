require('dotenv').config();
const mongoose = require('mongoose');

const gachaPrizesSchema = require('./src/models/gacha-prizes-schema');

const Prize = gachaPrizesSchema(mongoose);

const seedDB = async () => {
  try {
    const connectionString =
      process.env.DB_CONNECTION || 'mongodb://127.0.0.1:27017';
    const dbNama = process.env.DB_NAMA || 'demo-db';
    const uri = `${connectionString}/${dbNama}`;
    await mongoose.connect(uri);
    console.log('Succesfully connected');

    const prizeList = [
      { nama: 'Emas 10 gram', kuotaTotal: 1, kuotaTerpakai: 0 },
      { nama: 'Smartphone X', kuotaTotal: 5, kuotaTerpakai: 0 },
      { nama: 'Smartwatch Y', kuotaTotal: 10, kuotaTerpakai: 0 },
      { nama: 'Voucher Rp. 100.000', kuotaTotal: 100, kuotaTerpakai: 0 },
      { nama: 'Pulsa Rp. 50.000', kuotaTotal: 500, kuotaTerpakai: 0 },
      {
        nama: 'Maaf, anda kurang beruntung',
        kuotaTotal: 5000,
        kuotaTerpakai: 0,
      },
    ];

    await Prize.deleteMany({});
    await Prize.insertMany(prizeList);
    process.exit();
  } catch (err) {
    console.error('Failed to connect:', err.message);
    process.exit(1);
  }
};

seedDB();
