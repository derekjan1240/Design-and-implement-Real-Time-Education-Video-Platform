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

	Course.find({courseType: req.params.courseType}).then((currentCourse) => {

        if(currentCourse.length>0 && currentCourse.length >= (req.params.page-1)*6){

            if(isNaN(req.params.page)){
				res.render('videopage', { 
					user: req.user, 
					Videopage: 'freevideos', 
					page: 1,
					courseList: currentCourse
				});
			}else{
				res.render('videopage', { 
					user: req.user, 
					Videopage: 'freevideos', 
					page: req.params.page,
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
	
	Course.find({courseType: req.params.courseType}).then((currentCourse) => {

        if(currentCourse.length>0 && currentCourse.length >= (req.params.page-1)*6){

            if(isNaN(req.params.page)){
				res.render('videopage', { 
					user: req.user, 
					Videopage: 'freevideos', 
					page: 1,
					courseList: currentCourse
				});
			}else{
				res.render('videopage', { 
					user: req.user, 
					Videopage: 'freevideos', 
					page: req.params.page,
					courseList: currentCourse
				});
			}

        }else{

            res.redirect('/');
        }
    });
	
});

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
		function(err, result) {
			if(err){
				console.log(err);
			}else{
				res.redirect('/profile/course');
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