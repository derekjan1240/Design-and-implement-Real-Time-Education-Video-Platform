const router = require('express').Router();
const passport = require('passport');

//登入中介
const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

//激活中介
const activeCheck = (req, res, next) => {
    if(!req.user.active){
        res.redirect('/profile');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'profile'});
});

router.get('/setting', activeCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'setting'});
});

router.get('/password', activeCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'password'});
});

router.get('/course', activeCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'course'});
});


router.post('/setting/modify',activeCheck,

    passport.authenticate('settingModify', { 

        successRedirect : '/profile/setting',
        failureRedirect: '/profile'
    })
);

// router.post('/password/modify',activeCheck,

//     passport.authenticate('passwordModify', { 

//         successRedirect : '/profile/password',
//         failureRedirect: '/profile'
//     })
// );


module.exports = router;