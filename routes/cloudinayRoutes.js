const express = require("express");
const fs = require("fs");
const router = express.Router();

const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const WomenProduct = require("../models/WomenSchema");

// router.post(
//     "/productAdd",
//     upload.fields([
//         { name: "mainImage", maxCount: 1 },
//         { name: "images", maxCount: 4 },
//     ]),
//     async (req, res) => {
//         try {
//             const {
//                 name,
//                 originalPrice,
//                 salePrice,
//                 description,
//                 category,
//                 stock,
//                 colors,
//                 sizes,
//             } = req.body;

//             // 🔹 MAIN IMAGE
//             const mainFile = req.files.mainImage?.[0];
//             if (!mainFile) {
//                 return res.status(400).json({ message: "Main image required" });
//             }

//             const mainUpload = await cloudinary.uploader.upload(mainFile.path, {
//                 folder: "products/main",
//             });

//             fs.unlinkSync(mainFile.path);

//             // 🔹 GALLERY IMAGES (ORDER PRESERVED)
//             const galleryUploads = [];
//             if (req.files.images) {
//                 for (const file of req.files.images) {
//                     const result = await cloudinary.uploader.upload(file.path, {
//                         folder: "products/gallery",
//                     });

//                     galleryUploads.push(result.secure_url);
//                     fs.unlinkSync(file.path);
//                 }
//             }

//             // 🔹 FINAL IMAGE ARRAY (MATCHES YOUR LOGIC)
//             const images = [
//                 mainUpload.secure_url, // index 0 → MAIN
//                 ...galleryUploads,     // index 1+ → GALLERY
//             ];

//             // 🔹 SAVE PRODUCT
//             if (category === "Men's Clothing") {
//                 const product = await Product.create({
//                     name,
//                     originalPrice,
//                     salePrice,
//                     description,
//                     category,
//                     stock,
//                     images,
//                     colors: JSON.parse(colors || "[]"),
//                     sizes: JSON.parse(sizes || "[]"),
//                 });
//             }
//             else {
//                 const product = await WomenProduct.create({
//                     name,
//                     originalPrice,
//                     salePrice,
//                     description,
//                     category,
//                     stock,
//                     images,
//                 });
//             }

//             res.status(201).json("product added successfully");
//         } catch (err) {
//             console.error(err);
//             res.status(500).json({ message: "Product upload failed" });
//         }
//     }
// );


router.post(
  "/productAdd",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "images", maxCount: 4 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        originalPrice,
        salePrice,
        description,
        category,
        stock,
        colors,
        sizes,
      } = req.body;

      let mainUploadUrl = null;
      let galleryUploads = [];

      // 🔹 MAIN IMAGE
      const mainFile = req.files?.mainImage?.[0];
      if (mainFile) {
        const result = await cloudinary.uploader.upload(mainFile.path, {
          folder: "products/main",
        });
        mainUploadUrl = result.secure_url;
        fs.unlinkSync(mainFile.path);
      }

      // 🔹 GALLERY IMAGES (ORDER PRESERVED)
      if (req.files?.images) {
        for (const file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "products/gallery",
          });
          galleryUploads.push(result.secure_url);
          fs.unlinkSync(file.path);
        }
      }

      // 🔹 FINAL IMAGE ARRAY (MATCHES YOUR LOGIC)
      const images = [
        mainUploadUrl || "", // if no main image, keep empty string
        ...galleryUploads,   // gallery images (may be empty)
      ];

      // 🔹 SAVE PRODUCT
      if (category === "Men's Clothing") {
        await Product.create({
          name,
          originalPrice,
          salePrice,
          description,
          category,
          stock,
          images,
          colors: JSON.parse(colors || "[]"),
          sizes: JSON.parse(sizes || "[]"),
        });
      } else {
        await WomenProduct.create({
          name,
          originalPrice,
          salePrice,
          description,
          category,
          stock,
          images,
        });
      }

      res.status(201).json({ message: "Product added successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Product upload failed" });
    }
  }
);



module.exports = router;
