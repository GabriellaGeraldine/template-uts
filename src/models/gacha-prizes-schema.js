module.exports = (db) =>
  db.model(
    'Prizes',
    db.Schema({
      nama: {
        type: String,
        required: true,
      },
      kuota: {
        type: Number,
        required: true,
      },
      kuota_keluar: {
        type: Number,
        default: 0,
      },
    })
  );
