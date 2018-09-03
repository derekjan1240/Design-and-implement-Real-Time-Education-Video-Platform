const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');

// auth login
router.get('/login', (req, res) => {
    res.render('loginpage', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


router.post('/signin', 
		passport.authenticate('signin', {
	   		successRedirect: '/profile',
	   		failureRedirect: '/auth/login' 
		})
  );

router.post('/signup', 
    passport.authenticate('signup', { 
  		successRedirect : '/profile',
   		failureRedirect: '/auth/login' 
	})
  );

// auth with Line
router.get('/line', passport.authenticate('line', {
    scope: ['profile', 'openid', 'email']
}));

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile','email']
}));

// auth with twitter
router.get('/twitter', passport.authenticate('twitter',{
	scope: ['profile']
}));

// auth with facebook
router.get('/facebook', passport.authenticate('facebook'));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/auth/login' }), (req, res) => {
    // res.send(req.user);
    //user password cheak
    if(bcrypt.compareSync('0000', req.user.password)){
      res.render('profile', { user: req.user, Msg:'profile', ErroMsg:'預設密碼為 0000 請自行更改'});
    }else{
      res.render('profile', { user: req.user, Msg:'profile', ErroMsg:''});
    }
});

router.get('/twitter/redirect', passport.authenticate('twitter' ,{ failureRedirect: '/auth/login' }), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

router.get('/facebook/redirect', passport.authenticate('facebook',{ failureRedirect: '/auth/login' }), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

router.get('/line/callback', passport.authenticate('line',{ failureRedirect: '/auth/login' }), (req, res) => {
    res.send(req.user);
    res.redirect('/profile');
});



module.exports = router;