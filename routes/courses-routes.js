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

	let _courseName,
		_coursePrice;

	let promise = new Promise((resolve, reject) => {

		Course.findOne({courseName: req.params.courseName}).then((currentCourse)=>{
			if(currentCourse){

				_courseName = currentCourse.courseName;
				_coursePrice = currentCourse.coursePay;
				console.log('_courseName  2: ',_courseName);
				console.log('_coursePrice 2: ',_coursePrice);

				resolve(currentCourse);
			}else{
				//無此商品課程
				reject("無此商品課程");
			}		
		});

      }).then((currentCourse) => {
      	console.log(currentCourse);

      	User.findOne({username: req.user.username}).then((currentUser) => {

			if(currentUser.shoppingCartCourse.indexOf(req.params.courseName) >=0 ){
				console.log(req.params.courseName, 'Course has been added to shopping cart!')
			}else{
				//將課程加入會員購物車db
				currentUser.shoppingCartCourse.push(currentCourse);
			}

	        currentUser.save().then((newUser) => {
	            console.log(req.params.courseName, 'add success!')
	            res.redirect('/profile/shoppingCart');
	        });
	    });

      }, (reason) => {
        //erro handling
        console.log(reason);
        res.redirect('/course/pay/CS/1');
      });

});

//會員管理課程(退出購物車)
router.get('/removeformcart/:courseName', authCheck, (req, res) => {

	User.update(
		{username: req.user.username},
		{ $pull: {"shoppingCartCourse" : { "courseName": req.params.courseName }  } },
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