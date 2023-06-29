const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
    name: { 
        type: String, 
        required: [true, "Please enter your name"]
    },
    surname: {
        type: String,
        required: [true, "Please enter your surname"]
    },
    city: { type: String},
    coutry: {type: String},
    date_of_birth: { type: String},
    phone_number: { type: String},
    citizenship: { type: String},
    gender: { type: String},
    experience: { type: String},
    uni_name: { type: String},
    faculty: { type: String},
    specialization: {type: String },
    name_of_diploma: {type: String},
    year_of_graduation: { type: String},
    courses: {type: String},
    languages: { type: String},
    recommendations: { type: String},
    hobbies: { type: String}
});

userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
    }
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});

    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) return user;
        throw Error('incorrect password');
    }

    throw Error('incorrect email');
}

const User = mongoose.model('user', userSchema);

module.exports = User;