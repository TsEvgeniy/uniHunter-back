const User = require('../models/User');
const jwt = require('jsonwebtoken');

const maxDate = 3 * 24 * 60 * 60;

const createToken = id => {
    return jwt.sign({id}, 'secret', {
        expiresIn: maxDate
    })
}

const handleErrors = err => {
    let errors = {
        email: '',
        password: ''
    }

    if (err.message === 'incorrect email') {
        errors.email = 'This email is not registered';
    }
    if (err.message === 'incorrect password') {
        errors.email = 'This password is incorrect';
    }
    if (err.code === 11000) {
        errors.email = 'This email is already registered';
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

module.exports.signup_get = (req, res) => {
    res.send({message: 'signup_get'})
}

module.exports.signup_post = async (req, res) => {
    const { email, password, name, surname } = req.body;
    try {
        const user = await User.create({
            email, password, name, surname
        });

        const token = createToken(user._id);

        res.cookie('jwt', token, { httpOnly: true, maxDate });

        res.status(201).json({user: user._id});
    } catch(err) {
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_get = (req, res) => {
    res.send({message: 'login_get'})
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);

        res.cookie('jwt', token, { httpOnly: true, maxDate });
        res.status(200).json({user: user._id})
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxDate: 1});
    res.send({});
}

module.exports.update_profile = async (req, res) => {
    const {uni_name} = req.body;
    const user = await User.findById({_id: res.locals.user.id});
    user.set({uni_name});

    user.save()

    res.send({user})
}