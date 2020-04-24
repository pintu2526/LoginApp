const bcrypt = require('bcryptjs');
const db = require('../models/db');
const User = db.User;

module.exports = {
  create,
  login
};

async function create(userParam) {
  if(userParam.password != userParam['confirmPassword']){
    throw 'password and confirm password must be same';
  }
  // validate
  if (await User.findOne({ email: userParam.email })) {
    throw userParam.email + ' is already taken';
  }

  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }
  console.log('user',user)

  // save user
  return await user.save();
}

async function login(userParam) {
  // validate
  let user = await User.findOne({ email: userParam.email });

  if (user) {
    if(!bcrypt.compareSync(userParam.password, user.hash)){
      throw 'incorrect password';
    } else {
      return user;
    }
  } else {
    throw userParam.email + " does'nt exist";
  } 
}