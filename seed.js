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
      { nama: 'Emas 10 gram', kuota: 1, kuota_keluar: 0 },
      { nama: 'Smartphone X', kuota: 5, kuota_keluar: 0 },
      { nama: 'Smartphone Y', kuota: 10, kuota_keluar: 0 },
      { nama: 'Pulsa Rp. 50.000', kuota: 500, kuota_keluar: 0 },
      { nama: 'Maaf, anda kurang beruntung', kuota: 5000, kuota_keluar: 0 },
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
