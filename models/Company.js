const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const companySchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Minimum password length is 6"]
    },
    name: { type: String},
    surname: {type: String},
    phone_number: { type: String},
    name_of_company: {type: String},
    sphere_of_activity: {type: String},
    desc: { type: String}
});

companySchema.pre('save', async function(next) {
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
}
next();
});

companySchema.statics.login = async function(email, password) {
    const company = await this.findOne({email});

    if (company) {
        const auth = await bcrypt.compare(password, company.password);
        if (auth) return company;
        throw Error('incorrect password');
    }

    throw Error('incorrect email');
}

const Company = mongoose.model('company', companySchema);

module.exports = Company;