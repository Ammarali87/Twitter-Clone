import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,  
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  }
});

export default upload;






// import multer from "multer";


// // (temporary storage before uploading 
// // to Cloudinary)
// // const storage = multer.memoryStorage();

// //pass var Obj in multer to
//  //  Store file in memory

// // const upload = multer({ storage });
// // const upload=multer({ storage: multer.memoryStorage() }); // تخزين الملف في الذاكرة

// const upload = multer({ dest: 'uploads/' });

// export default upload;

