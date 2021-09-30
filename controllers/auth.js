const { validationResult } = require('express-validator');
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { countDocuments } = require('../models/product');
exports.signOut = (req, res) => {
    //console.log(req.body);
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
    });
};

exports.signUp = (req, res) => {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    };

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ error: "Not able to save user" })
        }
        else {
            res.json({
                id: user.id,
                name: user.name,
                lastname: user.lastname,
                email: user.email

            });
        }
    });

}

exports.signIn = (req, res) => {

    const { email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    };

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            res.status(400).json({ error: "User email doesn't exist" })
        }
        if (!user.authenticate(password)) {
            return res.status(401).json({ error: "email and password do not match" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        res.cookie("token", token, { expire: new Date() + 9999 });
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    })
}

exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
})


exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({ error: "access denied" });
    }
    next();
}
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({ error: "you are not admin" })
    }
    next();
};









