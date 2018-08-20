const router = require('express').Router();
const passport = require('passport');

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
    res.redirect('/profile');
});

router.get('/twitter/redirect', passport.authenticate('twitter' ,{ failureRedirect: '/auth/login' }), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

router.get('/facebook/redirect', passport.authenticate('facebook',{ failureRedirect: '/auth/login' }), (req, res) => {
    // res.send(req.user);
    res.redirect('/profile');
});

module.exports = router;