const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flowersSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  isPrefered: { type: Boolean, required: true, default: false },
});

const Flowers = mongoose.model("flowers", flowersSchema);

const createFlower = (name, description, category, price, img, userId) => {
  let flowerToAdd = {
    name,
    description,
    category,
    price,
    img,
    userId,
  };

  const flower = new Flowers(flowerToAdd);
  return flower.save();
};

const selectFlowers = () => {
  return Flowers.find();
};

const selectFiewFlowers = () => {
  return Flowers.find().limit(4);
};

const selectUserFlowers = (userId) => {
  return Flowers.find({ userId: userId });
};

const selectUserPreferedFlowers = (userId) => {
  return Flowers.find({ userId, isPrefered: true });
};

const selectFlowerById = (id) => {
  return Flowers.findOne({ _id: id });
};

const updateFlowerById = (id, name, description, category, price, img, isPrefered, userId) => {
  let flowerToUpdate = {
    name,
    description,
    category,
    price,
    img,
    isPrefered,
    userId
  };
  return Flowers.findOneAndReplace({ _id: id }, flowerToUpdate);
};

const setToPrefered = (id, name, description, category, price, img, isPrefered, userId) => {
  let newIsPreferedVal = true;
  if(isPrefered == true) newIsPreferedVal = false;
  let flowerToUpdate = {
    name,
    description,
    category,
    price,
    img,
    isPrefered: newIsPreferedVal,
    userId
  };
  return Flowers.findOneAndReplace({ _id: id }, flowerToUpdate);
};

const deleteFlowerById = (id) => {
  return Flowers.findOneAndRemove({ _id: id });
};

module.exports = {
  createFlower,
  selectFlowers,
  selectFiewFlowers,
  selectFlowerById,
  updateFlowerById,
  setToPrefered,
  selectUserFlowers,
  selectUserPreferedFlowers,
  deleteFlowerById,
};
