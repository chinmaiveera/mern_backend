const express = require("express");
const { getUserById, getUser, getAllUsers, updateUser, userPurchaseList } = require("../controllers/user")
const { isSignedIn, isAuthenticated } = require("../controllers/auth")
const router = express.Router();
router.param("userId", getUserById)

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);
router.put("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);
//router.get("/getallusers", getAllUsers);


module.exports = router;
