const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log("hurray we are connected")
// });

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique : true },
  hash: { type: String, required: true },
  linkedId: { type: String, required: true },
  isAdmin: { type: Boolean},
  createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

var Users = mongoose.model('user', schema);

module.exports = Users;