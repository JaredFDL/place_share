const User = require('../models/user');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');


const getUsers = async (req, res, next) => { 
    let users;
    try { 
        users = await User.find({}, '-password').lean();
    } catch (err) { 
        return next(new HttpError('Fetching users failed, please try again later.', 500));
    }
    res.status(200).json({users});
};

const signup = async (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { name, email, password } = req.body;

    let existingUser;
    try { 
        existingUser = await User.findOne({email});
    } catch (err) { 
        return next(new HttpError('Signing up failed, please check your inputs.', 500));
    }

    if (existingUser) { 
        return next(new HttpError('User exists already.', 422));
    }

    const createdUser = new User({
        name,
        email,
        password,
        image: req.file.path,
        places: []
    });

    try {
        await createdUser.save();
    } catch (e) { 
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({user: createdUser.toObject()});
};

const login = async (req, res, next) => { 
    const { email, password } = req.body;

    let existingUser;
    try { 
        existingUser = await User.findOne({email, password}).lean();
    } catch (err) { 
        return next(new HttpError('Logging in failed, please try again later.', 500));
    }

    if (!existingUser) { 
        return next(new HttpError('Invalid credentials, please check your inputs.', 500));
    }

    res.json({ message: 'logged in', user: existingUser });
};

module.exports = {
    getUsers,
    signup,
    login
};