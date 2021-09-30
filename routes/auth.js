const express = require("express");
const { check, validationResult } = require("express-validator");
var router = express.Router();
var { signOut, signUp, signIn, isSignedIn } = require('../controllers/auth')


router.post("/signup",
    check("name", "name should be atleast 3 characters long").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "password must be of length 3 characters").isLength({ min: 3 }),
    signUp);

router.post("/signin",
    check("email", "email is required").isEmail(),
    check("password", "password field is required").isLength({ min: 1 }),
    signIn);

router.get("/signout", signOut);
router.get("/test", isSignedIn, (req, res) => {
    res.json(req.auth);
});
module.exports = router;

