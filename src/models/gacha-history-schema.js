module.exports = (db) =>
  db.model(
    'gachaHistory',
    db.Schema(
      {
        userEmail: String,
        userNama: String,
        prizeNama: String,
        status: String,
      },
      { timestamps: true }
    )
  );
