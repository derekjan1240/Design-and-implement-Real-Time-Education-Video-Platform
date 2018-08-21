const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');

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
    res.render('profile', { user: req.user , Msg:'profile', ErroMsg:''});
});

router.get('/setting', activeCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'setting', ErroMsg:''});
});

router.get('/password', activeCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'password', ErroMsg:''});
});

router.get('/course', activeCheck, (req, res) => {
	//console.log('req',req.user,'\n');
    res.render('profile', { user: req.user , Msg:'course', ErroMsg:''});
});

//變更密碼
router.post('/password/modify',activeCheck, (req, res, next) => {

    //console.log('cheaking ...');
    
    if(req.body.newPassword != req.body.newPasswordCheak){
        //新密碼一不一樣
        res.render('profile', { user: req.user, Msg:'password', ErroMsg:'新密碼不一致'});

    }else if(!bcrypt.compareSync(req.body.oldPassword, req.user.password)){
        //舊密碼一不一樣
        res.render('profile', { user: req.user, Msg:'password', ErroMsg:'原密碼錯誤'});

    }else{
        //console.log('cheak ok!');
        //更改帳號資料
        next();
    }
},
    passport.authenticate('passwordModify', { 

        successRedirect : '/profile/password',
        failureRedirect: '/profile'

    })
);

//變更帳號名稱&信箱
router.post('/setting/modify',activeCheck, (req, res, next) => {

    //console.log('cheaking ...');
    
    if(req.body.Name === '' || req.body.Email === ''){
        //輸入空白
        res.render('profile', { user: req.user, Msg:'setting', ErroMsg:'輸入包含空白'});

    }else{
        //console.log('cheak ok!');
        //更改帳號資料
        next();
    }
},

    passport.authenticate('settingModify', { 

        successRedirect : '/profile/setting',
        failureRedirect: '/profile'
    })
);


module.exports = router;