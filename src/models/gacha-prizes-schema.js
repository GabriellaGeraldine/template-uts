module.exports = (db) =>
  db.model(
    'Prizes'
    db.Schema({
      nama: {
        type: String,
        required: true
      },
      kuota: {
        type: Number,
        required: true;
        min: 0
      } 
    })
  );

