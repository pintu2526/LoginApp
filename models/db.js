const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/LoginApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports = {
  User: require('./userModel')
};