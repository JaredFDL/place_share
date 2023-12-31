const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const placeControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/file-upload');

router.get('/:pid', placeControllers.getPlaceById); 

router.get('/user/:uid', placeControllers.getPlacesByUserId);

router.post('/', 
    fileUpload.single('image'),
    [check('title').not().isEmpty(), check('description').isLength({ min: 5 }), check('address').not().isEmpty()], placeControllers.createPlace);

router.patch('/:pid', [check('title').not().isEmpty(), check('description').isLength({min: 5})], placeControllers.updatePlace);

router.delete('/:pid', placeControllers.deletePlace);

module.exports = router;