const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const passport = require("passport");


const session = {session: false};

const profile = (req, res, next) => {
    res.status(200).json({msg: "profile", user: req.user, token: req.query.secret_token});
};

const register = (req, res, next) => {
    req.user.email ? res.status(201).json({msg: "registered", user: req.user}) : res.status(401).json({msg: "User already exists"});
};

const login = (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        try {
            if (err) {
                res.status(500).json({msg: "Internal Server Error"});
            } else if (!user) {
                res.status(401).json(info);
            } else {
                const loginFn = (error) => {
                    if (error) {
                        return next(error);
                    } else {
                        const userData = {id: user.id, email: user.email};
                        const data = {user, token: jwt.sign({user: userData}, process.env.SECRET_KEY)}
                        res.status(200).json(data);
                    }
                }

                req.login(user, session, loginFn);
            }
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
};

// router.post("/login", (req, res) => {
//     res.status(200).json({msg: "login", body: req.body})
// });

router.get("/", passport.authenticate("jwt", session), profile);
router.post("/register", passport.authenticate("register", session), register);
router.get("/login", login);

module.exports = router;