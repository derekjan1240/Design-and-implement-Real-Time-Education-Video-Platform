const router = require('express').Router();
const User = require('../models/user-model');
const Bill = require('../models/bill-model');

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        next();
    }
};

//激活中介
const activeCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/auth/login');
    } else {
        if(!req.user.active){
            res.redirect('back');
        } else {
           next();
        }
    }
    
};

/* 驗證 */
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

/* 帳號 */
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


/* 帳單處理 */
//帳單資訊頁面路由
router.get('/:billid/showbill', authCheck, (req, res) => {

    if(req.user.bill.indexOf(req.params.billid) === -1){
        //非使用者本身的訂單
        res.render('billpage', {user: req.user, bill:'', erroMsg: '非使用者本身的訂單'});

    }else{
        //登入且查詢id為自身
        Bill.findOne({_id: req.params.billid}).then((currentBill) => {
            if(currentBill){

                res.render('billpage', {user: req.user, bill: currentBill, erroMsg: ''});

            } else {
                res.render('billpage', {user: req.user, bill:'', erroMsg: '查無訂單'});
            }
        });
    }
});


//創建帳單
router.post('/:id/checkbill',activeCheck, (req, res, next) => {
 

    let promise = new Promise((resolve, reject) => {

        if(req.params.id!=req.user._id){
            reject("User id 錯誤");
        }

        new Bill({
            hostMember: req.user.email,
            totalPrice: req.body.totalPrice,
            totalItem: req.body.item.length/2,
            itemList: req.body.item,
            active: false

        }).save().then((newBill) => {
            // console.log('> created new bill!');
            resolve(newBill);
        });

        
      }).then((newBill) => {

        User.findOne({username: req.user.username}).then((currentUser) => {

            // console.log('currentUser: ', currentUser);

            //將新訂單加入會員db
            currentUser.bill.push(newBill._id);

            //整理購物車
            for(var j=1; j<newBill.itemList.length; j+=2){


                for(var i=0; i<req.user.shoppingCartCourse.length; i++){

                    if(currentUser.shoppingCartCourse[i].courseName === newBill.itemList[j]){

                        let removedCourseOfCart = currentUser.shoppingCartCourse.splice(i, 1);
                        // console.log('\mremovedCourseOfCart: ',removedCourseOfCart);
                        break;
                    }
                }
            }

            currentUser.save().then((newUser) => {
                // console.log('newUser:',newUser);

                res.redirect('/user/' + newBill._id.toString() +'/showbill');
            });
        });

      }, (reason) => {
        //erro handling
        console.log(reason);
        res.redirect('back');
      });

});

/*完成結帳*/
//帳單完成後激活 && 刪除會員db內代繳訂單ID編號 && 新增訂單課程至使用者課程清單
router.get('/:billid/finished', authCheck, (req, res) => {

    if(req.user.bill.indexOf(req.params.billid) === -1){
        //非使用者本身的訂單
        res.render('billpage', {user: req.user, bill:'', erroMsg: '非使用者本身的訂單'});
    }

    let promise = new Promise((resolve, reject) => {

         Bill.findOne({_id: req.params.billid}).then((currentBill) => {
            if(currentBill){

                //激活帳單(表示已付款)
                currentBill.active = true;

                currentBill.save().then((newBill) => {
                    console.log('付款完成: ',newBill);
                    resolve(newBill);
                });

            } else {
                //查無訂單
                res.render('billpage', {user: req.user, bill:'', erroMsg: '查無訂單'});
                reject("查無訂單");
            }
        });

      }).then((newBill) => {

        User.findOne({username: req.user.username}).then((currentUser) => {

            //刪除會員db內代繳訂單ID編號
            let removedBillId = currentUser.bill.splice(currentUser.bill.indexOf(newBill._id), 1);

            //新增訂單課程至使用者課程清單
            for(var i=1; i<newBill.itemList.length; i+=2){
                currentUser.ownedCourse.push( newBill.itemList[i]);
            }

            currentUser.save().then((newUser) => {
                console.log('\nnewUser.ownedCourse:',newUser.ownedCourse);
                console.log('newUser.bill:',newUser.bill);
                res.redirect('/profile');
            });
        });

      }, (reason) => {
        //erro handling
        console.log(reason);
        res.redirect('back');
      });
});


module.exports = router;