const express = require("express");
const router = express.Router();

const multer = require("../../config/multerTypes");
const upload = multer.createMulter(
  "../flowers-app-client/public/uploads/",
  3000000,
  multer.allowedTypes.img
);

const flowersValidation = require("../../validation/flowers.validation");
const flowersModel = require("../../models/Flowers.model");
const auth = require("../../middlewares/auth");

router.post("/", auth, upload.single("flowerimg"), async (req, res) => {
  try {
    if (!req.payload.isAdmin)
      return res.status(400).send("Only admin can add flowers");

    const validatedValue = await flowersValidation.FlowerValidation(req.body);
    console.log(validatedValue);

    let img = "";
    if (req.file) img = "/uploads/" + req.file.filename;

    const flower = await flowersModel.createFlower(
      validatedValue.name,
      validatedValue.description,
      validatedValue.category,
      validatedValue.price,
      img,
      req.payload._id
    );
    res.status(201).json(flower);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/fewflowers", auth, async (req, res) => {
  try {
    const flowers = await flowersModel.selectFiewFlowers();
    res.json(flowers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/my-flowers", auth, async (req, res) => {
  try {
    const flowers = await flowersModel.selectUserFlowers(req.payload._id);
    res.json(flowers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/preferedflowers", auth, async (req, res) => {
  try {
    const flowers = await flowersModel.selectUserPreferedFlowers(req.payload._id);
    res.json(flowers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const flower = await flowersModel.selectFlowerById(req.params.id);
    res.json(flower);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const flowers = await flowersModel.selectFlowers();
    res.json(flowers);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.put("/settoprefered/:id", auth, async (req, res) => {
  try {
    await flowersModel.setToPrefered(
      req.params.id,
      req.body.name,
      req.body.description,
      req.body.category,
      req.body.price,
      req.body.img,
      req.body.isPrefered,
      req.payload._id
    );
    res.status(201).json();
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.put("/:id", auth, upload.single("flowerimg"), async (req, res) => {
  try {
    if (!req.payload.isAdmin)
      return res.status(400).send("Only admin can edit flowers");

    const validatedValue = await flowersValidation.FlowerValidation(req.body);

    let flower = await flowersModel.selectFlowerById(req.params.id);

    let img = "";
    if (req.file) img = "/uploads/" + req.file.filename;
    else img = flower.img;

    await flowersModel.updateFlowerById(
      req.params.id,
      validatedValue.name,
      validatedValue.description,
      validatedValue.category,
      validatedValue.price,
      img,
      validatedValue.isPrefered,
      req.payload._id
    );
    res.status(201).json("Flower updated successfully");
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.payload.isAdmin)
      return res.status(400).send("Only admin can delete flowers");

    await flowersModel.deleteFlowerById(req.params.id);
    res.status(201).json("Flower deleted successfully");
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = router;
