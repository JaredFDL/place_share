const axios = require('axios');

const API_KEY = 'AIzaSyBeVl6E01OLwzFIV6fEV5oheF-yKteq1IM';
const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) { 
    const res = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
    const data = res.data;
    if (!data || data.status === 'ZERO_RESULTS') { 
        const error = new HttpError('Could not find location for the speciifed address', 422);
        throw error;
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates;
}

module.exports = getCoordsForAddress;