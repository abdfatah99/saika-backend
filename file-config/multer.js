import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/event-image");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toString().replace(/:/g, "-") + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        const error = new Error("Only .jpeg and .png are accepted");
        cb(error, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: fileFilter,
});

export default upload;
