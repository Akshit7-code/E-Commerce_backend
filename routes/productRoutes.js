const express = require("express");
const router = express.Router();
const MenProduct = require("../models/Product");
const WomenProduct = require("../models/WomenSchema");

// Add product
router.post("/add", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json({ message: "Product added" });
});

// Get all products
router.get("/MenProduct", async (req, res) => {
  try {
    const products = await MenProduct.find();
    res.json(products);
    
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/product/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  let ProductModel;
  if (type === "Men") ProductModel = MenProduct;
  else if (type === "Women") ProductModel = WomenProduct;
  else return res.status(400).json({ message: "Invalid product type" });

  const product = await ProductModel.findById(id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  res.json(product);
});


router.get("/WomenProduct", async (req, res) => {
  try {
    const products = await WomenProduct.find();
    res.json(products);

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.patch("/update-price/:type/:id", async (req, res) => {
  const { type, id } = req.params;
  const { originalPrice, salePrice } = req.body;

  let ProductModel;
  if (type === "Men") ProductModel = MenProduct;
  else if (type === "Women") ProductModel = WomenProduct;
  else return res.status(400).json({ message: "Invalid product type" });

  try {
    const updated = await ProductModel.findByIdAndUpdate(
      id,
      { originalPrice, salePrice },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully", product: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete("/delete-product/:type/:id", async (req, res) => {
  const { type, id } = req.params;

  let ProductModel;
  if (type === "Men") ProductModel = MenProduct;
  else if (type === "Women") ProductModel = WomenProduct;
  else return res.status(400).json({ message: "Invalid product type" });

  try {
    const deleted = await ProductModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
