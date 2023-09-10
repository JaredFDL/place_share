const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fs = require('fs');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');


const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).lean();
    } catch (e) { 
        const error = new HttpError('Something went wrong, could not find the place', 500);
        return next(error);
    }


    if (!place) {
        const error = new HttpError('Could not find the place for the provided id', 404);
        return next(error);
    }
    res.json({place});
};

const getPlacesByUserId = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const userId = req.params.uid;
    let places;
    try {
        places = await Place.find({ creator: userId }).lean();
    } catch (err) {
        return next(new HttpError('Fetching places failed, please try again.', 500));
    }

    if (!places || places.length === 0) {
        return next(new HttpError('Could not find the place for the provided user id.', 404));
    }

    res.json({places});
};

const createPlace = async (req, res, next) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) { 
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) { 
        return next(error);
    }


    const createdPlace = new Place({
        title,
        description,
        address,
        creator,
        location: coordinates,
        image: req.file.path
    });

    let user;
    try { 
        user = await User.findById(creator);
    } catch (err) { 
        return next(new HttpError('Creating place failed, please try again.', 500));
    }

    if (!user) { 
        return next(new HttpError('Could not find user for provided id', 404));
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPlace.save({session});
        user.places.push(createdPlace);
        await user.save({ session });
        await session.commitTransaction();
    } catch (err) { 
        const error = new HttpError('Creating place failed, please try again', 500);
        return next(error);
    }

    res.status(201).json({place: createdPlace});
};

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findByIdAndUpdate(placeId, { $set: { title, description } }, {lean: true});
     } catch (err) { 
        return next(new HttpError('Something went wrong, could not update place', 500));

    }

    res.status(200).json({place});
};

const deletePlace = async (req, res, next) => { 
    const placeId = req.params.pid;
    let place;
    try { 
        const session = await mongoose.startSession();
        session.startTransaction();
        place = await Place.findByIdAndDelete(placeId).populate('creator').session(session);
        if (!place) { 
            throw new HttpError('Could not find the place for the provided id.', 404);
        }
        place.creator.places.pull(place);
        await place.creator.save({session});
        await session.commitTransaction();
    } catch (err) { 
        if (err instanceof HttpError) { 
            return next(err);
        }
        return next(new HttpError('Something went wrong, please try again', 500));
    }
    fs.unlink(place.image, (err) => { 
        if (err) { 
            next(err);
        }
    });
    res.status(200).json({ message: 'Deleted successfully' });
};

module.exports = {
    getPlacesByUserId,
    getPlaceById,
    createPlace,
    updatePlace,
    deletePlace
};