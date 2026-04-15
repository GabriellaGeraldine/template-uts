module.exports = (db) =>
  db.model(
    'gachaUsers',
    db.Schema({
      email: String,
      password: String,
      fullName: String,
    })
  );
