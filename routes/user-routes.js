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


// 驗證email
router.get('/:id/emailverify', authCheck, (req, res, next) => {
	if(req.params.id!=req.user._id){
		res.render('profile', { user: req.user ,Msg: 'Please login YOUR account!'});
	}else{
		
		User.findOne({_id: req.params.id}).then((currentUser) => {
            currentUser.active = true;
            currentUser.save().then(() => {
                console.log('email verify succese!');
                res.render('profile', { user: currentUser , Msg:'profile', ErroMsg:'Email verify succese!'});
            });
        });
	}	
});

// 帳號資訊 res.json
router.get('/:id/account', authCheck, (req, res, next) => {

    if(req.params.id!=req.user._id){
        //登入但查詢id非自身
        res.json({'Error':'wrong id!'});

    }else{
        //登入且查詢id為自身
        User.findOne({_id: req.params.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('> req.user: ', req.user);
                // res.render('profile', { user: req.user });
                res.json(currentUser);
            } else {
                res.json({'Error':'wrong id!'});
            }
        });
    }
});

// 帳號資訊 res.json
router.get('/:id/cart', authCheck, (req, res, next) => {

    if(req.params.id!=req.user._id){
        //登入但查詢id非自身
        res.json({'Error':'wrong id!'});

    }else{
        //登入且查詢id為自身
        User.findOne({_id: req.params.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('> req.user: ', req.user);
                // res.render('profile', { user: req.user });
                res.json(currentUser);
            } else {
                res.json({'Error':'wrong id!'});
            }
        });
    }
});

// 使用者上傳影片
router.post('/:id/postvideo', authCheck, function(req, res, next){
	
 

});


module.exports = router;