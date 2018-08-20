const router = require('express').Router();

const activeCheck = (req, res, next) => {
    if(!req.user.active){
        res.redirect('/course/free/CS/1');
    } else {
        next();
    }
};

router.get('/', activeCheck, (req, res) => {
    res.render('videopostpage', { user: req.user, Videopage: 'postvideos'});
});

module.exports = router;