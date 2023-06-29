const Company = require('../models/Company');
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
    if (err.message.includes('company validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const company = await Company.create({
            email, password
        });
        const token = createToken(company._id);

        res.cookie('jwt', token, { httpOnly: true, maxDate });
        res.status(201).json({company: company._id});
    } catch(err) {
        console.log(err);
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const company = await Company.login(email, password);
        const token = createToken(company._id);

        res.cookie('jwt', token, { httpOnly: true, maxDate });
        res.status(200).json({company: company._id})
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxDate: 1});
    res.send({});
}

module.exports.profile_update = async (req, res) => {
    const {
        name,
        surname,
        phone_number,
        name_of_company,
        sphere_of_activity,
        desc
    } = req.body;
    const company = await Company.findById({_id: res.locals.company.id});

    company.set({
        name, surname, phone_number, name_of_company, sphere_of_activity, desc
    });

    company.save()

    res.send({company})
}