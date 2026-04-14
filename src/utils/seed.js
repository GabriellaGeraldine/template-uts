const mongoose = require('mongoose');
const Prize = require ('./src/components/gacha-prize-schema');

mongoose.connect('mongodb ://localhost:27017/demo-db');
  .then(async () => {
    console.log('Connected to MongoDB for seeding...');

    const initialPrize = [
      {name: 'Emas 10 gram', quota: 1},
      {name: 'Smartphone X', quota: 5},
      {name: 'Smartphone Y', quota: 10},
      {name: 'Voucher Rp.100.000', quota: 100},
      {name: 'Pulsa Rp. 50.000', quota: 500},
      {name: 'Maaf, anda kurang beruntung', quota: 5000}
    ];

    console.log('Seed success! Prizes created.');
    process.exit();
  });
.catch(err => {
  console.error('Seed failed:', err)
  process.exit(1);
});


  