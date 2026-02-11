import multer from 'multer';

// Disk storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Files ko 'public/temp' folder mein save karein
        // Ensure that the 'public/temp' directory exists in your project root
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        // File ka naam unique banane ke liye
        cb(null, file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname);
    }
});

// Multer upload instance
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Maximum file size 5MB (example)
    },
    fileFilter: (req, file, cb) => {
        // Sirf images ko allow karein
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});
