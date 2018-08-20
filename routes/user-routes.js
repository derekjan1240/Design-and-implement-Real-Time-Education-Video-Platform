const router = require('express').Router();
const User = require('../models/user-model');



const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

const emailVerifyCheck = (req, res, next) => {
    if(!req.user.active){
        res.redirect('/profile');
    } else {
        next();
    }
};

// 帳號資訊
router.get('/:id/account', authCheck, (req, res, next) => {

	if(req.params.id!=req.user._id){
		//登入但查詢id非自身
		res.render('profile', { user: req.user });

	}else{
		//登入且查詢id為自身
		User.findOne({_id: req.params.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('> req.user: ', req.user);
                res.render('profile', { user: req.user });
            } else {
                console.log('wrong id!');
            }
        });
	}
});

// 驗證email
router.get('/:id/emailverify', authCheck, (req, res, next) => {
	if(req.params.id!=req.user._id){
		res.render('profile', { user: req.user ,Msg: 'Please login YOUR account!'});
	}else{
		
		User.findOne({_id: req.params.id}).then((currentUser) => {
            currentUser.active = true;
            currentUser.save().then(() => {
                console.log('email verify succese!');
                res.render('profile', { user: currentUser ,Msg: 'Email verify succese!'});
            });
        });
	}	
});


// 列出使用者所有影片
router.get('/:id/videos', authCheck, emailVerifyCheck, (req, res, next) => {

	if(req.params.id!=req.user._id){
		//登入但查詢id非自身
		res.render('profile', { user: req.user });

	}else{
		//登入且查詢id為自身
		User.findOne({_id: req.params.id}).then((currentUser) => {
            console.log('list all videos!');
            //do something...
            res.render('videopage', { user: req.user, Videopage: 'freevideos' });
        });
	}
});

// 使用者上傳影片
router.post('/:id/postvideo', authCheck, function(req, res, next){
	
 

});

// 使用者修改帳號
router.put('/:id/modifyaccount', authCheck, function(req, res, next){


});

// 使用者移除帳號
router.delete('/:id/delaccount', authCheck, function(req, res, next){
    

});

module.exports = router;