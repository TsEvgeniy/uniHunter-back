const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, 'secret', (err, decodedToken) => {
            if (err) {
                res.send({message: "wrong"});
            } else {
                next();
            }
        })
    } else { 
        res.send({message: "wrong"});
    }
};

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'secret', async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }    
}

const checkCompany = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'secret', async (err, decodedToken) => {
            if (err) {
                res.locals.company = null;
                next();
            } else {
                let company = await Company.findById(decodedToken.id);
                res.locals.company = company;
                next();
            }
        })
    } else {
        res.locals.company = null;
        next();
    }    
}

module.exports = {
    requireAuth,
    checkUser,
    checkCompany
}