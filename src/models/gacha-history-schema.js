module.exports = (db) =>
  db.model(
    'History'
    db.Schema({
      fullName: String,
      description: String
    })
  );
