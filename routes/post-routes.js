const router = require('express').Router();
const multer  = require('multer')

const activeCheck = (req, res, next) => {

	if(!req.user){
        res.redirect('/auth/login');
    }else{
    	if(!req.user.active){
	        res.redirect('/course/free/CS/1');
	    } else {
	        next();
	    }
    }
};

/*postpage*/
router.get('/', activeCheck, (req, res) => {
    res.render('videopostpage', { user: req.user, Msg: ''});
});

/* multer config */
// storage and fileFilter
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './post-storge')
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  }
})

function fileFilter(req, file, cb) {

    var typeArray = file.mimetype.split('/');
	var fileType = typeArray[1];

	if (fileType == 'mp4') {
	  cb(null, true);
	} else {
	  cb(new Error('goes wrong on the mimetype'), false)
	}
}

let upload = multer({ 
	storage: storage, 
	limits: { fileSize: 50 * 1000 * 1000 },
	fileFilter: fileFilter 
}).single('recfile');


router.post('/user/upload',  (req, res)=> {

	upload( req, res, (err) => {

        if (err) {
        	// console.log('err:', err);
			res.render('videopostpage', { user: req.user , Msg: err});
	    }else{

	    	res.render('videopostpage', { user: req.user , Msg: 'Upload Successe!'});
	    }

    })
	
});


module.exports = router;