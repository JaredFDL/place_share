const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error')

const app = express();


//Resolving CORS issues.
app.use(cors());

//Parse the request body.
app.use(bodyParser.json());

app.use('/assets/uploads', express.static(path.join('assets', 'uploads')));

app.use('/api/places', placesRoutes);

app.use('/api/users', usersRoutes);

app.use((req, res, next) => { 
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => { 
            console.log(err);
        });
    }
    if (res.headersSent) { 
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred' });
});

mongoose.connect('mongodb+srv://J_Feng:3129FENGb@cluster0.sh5etmw.mongodb.net/app?retryWrites=true&w=majority')
    .then(() => { 
        app.listen(8000);
    })
    .catch((error) => { 
        console.log(error)
    });

