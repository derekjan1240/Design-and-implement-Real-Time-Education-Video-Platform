const Course = require('../models/course-model');
const User = require('../models/user-model');
const router = require('express').Router();

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

const activeCheck = (req, res, next) => {
    if(!req.user.active){
        res.redirect('/course/free/CS/1');
    } else {
        next();
    }
};

//免費影片
router.get('/free/:courseType/:page', (req, res) => {

	Course.find({courseType: req.params.courseType, coursePay: "Free"}).then((currentCourse) => {

        if(currentCourse.length>0 && currentCourse.length >= (req.params.page-1)*6){

            if(isNaN(req.params.page)){
				res.render('videopage', { 
					user: req.user, 
					page: 1,
					Msg: 'free',
					courseList: currentCourse
				});
			}else{
				res.render('videopage', { 
					user: req.user, 
					page: req.params.page,
					Msg: 'free',
					courseList: currentCourse
				});
			}

        }else{
            res.redirect('/');
        }
    });
	    
});

//付費影片
router.get('/pay/:courseType/:page', activeCheck, (req, res) => {
	
	Course.find({courseType: req.params.courseType, coursePay: { $ne: "Free" }}).then((currentCourse) => {

        if(currentCourse.length>0 && currentCourse.length >= (req.params.page-1)*6){

            if(isNaN(req.params.page)){
				res.render('videopage', { 
					user: req.user, 
					page: 1,
					Msg: 'pay',
					courseList: currentCourse
				});
			}else{
				res.render('videopage', { 
					user: req.user, 
					page: req.params.page,
					Msg: 'pay',
					courseList: currentCourse
				});
			}

        }else{

            res.redirect('/');
        }
    });
	
});

/* 收藏 */
//會員管理課程(加入收藏)
router.get('/collection/:courseName', authCheck, (req, res) => {

	User.findOne({username: req.user.username}).then((currentUser) => {
		//console.log('currentUser: ', currentUser);

		if(currentUser.collectionCourse.indexOf(req.params.courseName) >=0 ){
			console.log(req.params.courseName, 'Course has been added!')
		}else{
			currentUser.collectionCourse.push(req.params.courseName);
		}

        currentUser.save().then((newUser) => {
            //console.log('> user is: ', currentUser);
            res.redirect('/profile/course');
        });
    });

});

//會員管理課程(退出收藏)
router.get('/uncollected/:courseName', authCheck, (req, res) => {

	User.update(
		{username: req.user.username},
		{ $pull: {"collectionCourse" :req.params.courseName } },
		(err, result) => {
			if(err){
				console.log(err);
			}else{
				res.redirect('/profile/course');
			}
		}
	)

});

/* 購物車 */
//會員管理課程(加入購物車)
router.get('/addtocart/:courseName', authCheck, (req, res) => {

	User.findOne({username: req.user.username}).then((currentUser) => {
		//console.log('currentUser: ', currentUser);

		if(currentUser.shoppingCartCourse.indexOf(req.params.courseName) >=0 ){
			console.log(req.params.courseName, 'Course has been added to shopping cart!')
		}else{
			console.log(req.params.courseName, 'add success!')
			currentUser.shoppingCartCourse.push(req.params.courseName);
		}

        currentUser.save().then((newUser) => {
            //console.log('> user is: ', currentUser);
            res.redirect('/profile/shoppingCart');
        });
    });

});

//會員管理課程(退出購物車)
router.get('/removeformcart/:courseName', authCheck, (req, res) => {

	User.update(
		{username: req.user.username},
		{ $pull: {"shoppingCartCourse" :req.params.courseName } },
		(err, result) => {
			if(err){
				console.log(err);
			}else{
				res.redirect('/profile/shoppingCart');
			}
		}
	)

});


//保留按鍵路由
router.get('/start/:courseName', authCheck, (req, res) => {
	
    res.render('profile', { user: req.user , Msg:' '});
});


//課程頁面
router.get('/:courseName/:courseId', (req, res) => {

	Course.findOne({courseName: req.params.courseName}).then((currentCourse) => {

        if(currentCourse){

            res.render('coursepage', { 
				user: req.user, 
				courseName: currentCourse.courseName,
				courseAbout: currentCourse.courseAbout,
				courseId: req.params.courseId,
				courseEp: currentCourse.courseTotalEp
			});

        }else{
            res.redirect('/');
        }
    });
});



module.exports = router;