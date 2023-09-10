const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpeg'
};

const fileUpload = multer({
    limits: 100000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'assets/uploads');
        },
        filename: (req, file, cb) => {
            const extension = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + '.' + extension);
        }
    }),
    fileFilter: (req, file, cb) => { 
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        const error = isValid ? null : new Error('Invalid file type');
        cb(error, isValid);
    }

});

module.exports = fileUpload;