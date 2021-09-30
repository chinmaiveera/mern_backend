const express = require("express");
var router = express.Router();
const { getProductById, createProduct, photo, getProduct, deleteProduct, updateProduct, getAllProducts, getAllUniqueCatogeries } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);
router.param("productId", getProductById);

router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);
router.get("/product/photo/:productId", photo)
router.get("/product/:productId", getProduct)
//delete
router.delete("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, deleteProduct);
//update
router.put("/product/:productId/:userId", isSignedIn, isAuthenticated, isAdmin, updateProduct);

router.get("/products", getAllProducts);
router.get("/products/categories", getAllUniqueCatogeries);


module.exports = router;