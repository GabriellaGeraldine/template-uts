module.exports = (db) =>
  db.model(
    'Prizes',
    db.Schema({
      nama: {
        type: String,
        required: true,
      },
      kuotaTotal: {
        type: Number,
        required: true,
      },
      kuotaTerpakai: {
        type: Number,
        default: 0,
      },
    })
  );
