const router = require('express').Router();

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'profile'});
});

router.get('/setting', authCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'setting'});
});

router.get('/password', authCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'password'});
});

router.get('/course', authCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'course'});
});

module.exports = router;