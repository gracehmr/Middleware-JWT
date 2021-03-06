const bcrypt = require("bcrypt");
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JWTStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

const register = async (email, password, next) => {
    try {
        if (!email || !password) {
            throw new Error("Insufficient user info provided");
        }

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const passwordHash = await bcrypt.hash(password, salt);
        try {
            const user = await User.create({email, passwordHash});
            next(null, user);
        } catch (error) {
            next(error, {});
        }
    } catch (error) {
        next(error);
    }
};

const login = async (email, password, next) => {
    try {
        const user =  await User.findOne({where: {email}});
        
        if (!user) {
            return next(null, null, {msg: "Incorrect username"});
        } 

        const match = await bcrypt.compare(password, user.passwordHash);
        return match ? next(null, user) : next(null, null, {msg: "Incorrect password"});
    } catch (error) {
        next(error);
    }
};

const verify = (token, next) => {
    try {
        next(null, token.user);
    } catch (error) {
        next(error);
    }
};

const verifyStrategy = new JWTStrategy({
    secretOrKey: process.env.SECRET_KEY,
    jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token")
}, verify);

const registerStrategy = new LocalStrategy({usernameField: "email", passwordField: "password"}, register);
const loginStrategy = new LocalStrategy({usernameField: "email", passwordField: "password"}, login);

module.exports = {
    verifyStrategy,
    registerStrategy,
    loginStrategy
};