const express = require("express");
const router = express.Router();
const cartsModel = require("../../models/Carts.model");
const flowersModel = require("../../models/Flowers.model");
const auth = require("../../middlewares/auth");
const sendEmail = require("../../config/mailer");

router.post("/:id", auth, async (req, res) => {
  try {
    const cart = await cartsModel.addFlowerToCart(
      req.payload._id,
      req.params.id,
      req.body.quantity
    );
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/sumtopay", auth, async (req, res) => {
  try {
    const carts = await cartsModel.getUserCart(req.payload._id);
    let sumtopay = 0;
    for (let cart of carts) {
      const flowerData = await flowersModel.selectFlowerById(cart.flowerId);
      sumtopay += cart.quantity * flowerData.price;
    }
    res.status(201).json(sumtopay);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const carts = await cartsModel.getUserCart(req.payload._id);

    const result = [];
    for (let cart of carts) {
      const flowerData = await flowersModel.selectFlowerById(cart.flowerId);

      let flowerObj = {
        name: flowerData.name,
        description: flowerData.description,
        price: flowerData.price,
        category: flowerData.category,
        img: flowerData.img,
      };

      const res_obj = {
        _id: cart._id,
        userId: req.payload._id,
        flower: flowerObj,
        quantity: cart.quantity,
      };
      result.push(res_obj);
    }

    res.status(201).json(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/paypal", auth, async (req, res) => {
  try {
    const carts = await cartsModel.getUserCart(req.payload._id);

    const results = [];
    let sumToPay = 0;
    for (let cart of carts) {
      const flowerData = await flowersModel.selectFlowerById(cart.flowerId);
      sumToPay += cart.quantity * flowerData.price;

      let flowerObj = {
        name: flowerData.name,
        description: flowerData.description,
        price: flowerData.price,
        category: flowerData.category,
        img: flowerData.img,
      };

      const res_obj = {
        _id: cart._id,
        userId: req.payload._id,
        flower: flowerObj,
        quantity: cart.quantity,
      };
      results.push(res_obj);
    }

    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    const formattedToday = day + "/" + month + "/" + year;

    let html = "<h3>Your order details:</h3>";
    html += `<h3>Payment Date: ${formattedToday}</h3>`;
    html +=
      "<table colpadding='2' colspacing='2'><thead><tr style='text-align:center;background-color:black;color:white;'><th style='border:1px solid black;'>&nbsp;Name&nbsp;</th><th style='border:1px solid black;'>&nbsp;Description&nbsp;</th><th style='border:1px solid black;'>&nbsp;Category&nbsp;</th><th style='border:1px solid black;'>&nbsp;Price<br/>$USA&nbsp;</th><th style='border:1px solid black;'>Quantity</th><th style='border:1px solid black;'>&nbsp;Total Price<br/>$USA&nbsp;</th></tr></thead>";
    html += "<tbody>";
    for (r of results) {
      html += "<tr>";
      html += `<td style='text-align:center;border:1px solid black;'>${r.flower.name}</td>`;
      html += `<td style='text-align:center;border:1px solid black;'>${r.flower.description}</td>`;
      html += `<td style='text-align:center;border:1px solid black;'>${r.flower.category}</td>`;
      html += `<td style='text-align:center;border:1px solid black;'>${r.flower.price}</td>`;
      html += `<td style='text-align:center;border:1px solid black;'>${r.quantity}</td>`;
      html += `<td style='text-align:center;border:1px solid black;'>${
        r.flower.price * r.quantity
      } </td>`;
      html += "</tr>";
    }
    html += `<tr style='background-color:black;color:white'><td colspan='5' style='text-align:right'>Total to pay:</td><td style='text-align:center;'>${sumToPay.toFixed(2)} $USA</td></tr>`;
    html += "</tbody></table>";

    await sendEmail(
      process.env.EMAIL_EMAIL,
      req.payload.email,
      "Flowers App - payment opered successfully by Paypal",
      html
    );
    await cartsModel.deleteUserCart(req.payload._id);
    res.status(201).json("pp");
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await cartsModel.deleteCartById(req.params.id);
    res.status(201).json("Flower deleted successfully");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
