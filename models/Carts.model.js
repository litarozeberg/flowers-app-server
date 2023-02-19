const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  flowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "flowers",
    required: true
  },
  quantity:{ type: Number, required: true }
});

const Carts = mongoose.model("carts", cartsSchema);

const addFlowerToCart = (userId, flowerId, quantity) => {
  let cartToAdd = {
    userId,
    flowerId,
    quantity
  };

  const cart = new Carts(cartToAdd);
  return cart.save();
};

const getUserCart = (userId) => {
  return Carts.find( { userId })
}

const deleteCartById = (id) => {
  return Carts.findOneAndRemove( { _id: id });
}

const deleteUserCart = (userId) => {
  return Carts.deleteMany( { userId });
}

module.exports = {
  addFlowerToCart,
  getUserCart,
  deleteCartById,
  deleteUserCart
};