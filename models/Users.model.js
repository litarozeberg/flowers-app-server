const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String },
  isMailValid: { type: Boolean, default: false },
  secretKey: { type: String, required: false },
  isAdmin: { type: Boolean, default: true }
});

const Users = mongoose.model("users", usersSchema);

const findUserByEmail = (email) => {
  return Users.findOne({ email });
};

const createUser = (name, email, hashedPassword, img, secretKey) => {
  const user = new Users({
    name,
    email,
    password: hashedPassword,
    img,
    secretKey
  });
  user.save();
  return user;
};

const updateIsMailValid = (email) => {
  return Users.findOneAndUpdate({ email }, { isMailValid: true });
};

const updateUserPasswordByEmail = (email, hashedPassword) => {
  return Users.findOneAndUpdate({ email }, { password: hashedPassword });
};

const findUserDetails = (id) => {
  return Users.findById({_id: id});
}

module.exports = {
  findUserByEmail,
  createUser,
  updateIsMailValid,
  updateUserPasswordByEmail,
  findUserDetails
};
