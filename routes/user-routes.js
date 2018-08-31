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

//創建帳單
router.post('/:id/checkbill',activeCheck, (req, res, next) => {
 

    let promise = new Promise((resolve, reject) => {

        if(req.params.id!=req.user._id){
            reject("User id 錯誤");
        }

        new Bill({
            hostMember: req.user.email,
            totalPrice: req.body.totalPrice,
            totalItem: req.body.item.length,
            itemList: req.body.item,
            active: false

        }).save().then((newBill) => {
            // console.log('> created new bill!');
            resolve(newBill);
        });

        
      }).then((newBill) => {

        User.findOne({username: req.user.username}).then((currentUser) => {

            //將新訂單加入會員db
            currentUser.bill.push(newBill._id);

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


router.get('/:billid/showbill', authCheck, (req, res, next) => {

    if(req.user.bill.indexOf(req.params.billid) === -1){
        //非使用者本身的訂單
        res.render('billpage', {user: req.user, bill:'', erroMsg: '非使用者本身的訂單'});

    }else{
        //登入且查詢id為自身
        Bill.findOne({_id: req.params.billid}).then((currentBill) => {
            if(currentBill){

                res.render('billpage', {user: req.user, bill: currentBill, erroMsg: ''});

            } else {
                res.render('billpage', {user: req.user, bill:'', erroMsg: '無訂單'});
            }
        });
    }
});


// 使用者上傳影片
router.post('/:id/postvideo', authCheck, function(req, res, next){
	
 

});


module.exports = router;