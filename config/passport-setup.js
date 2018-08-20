const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const Mailer = require('./mailer');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

// LocalStrategy --------------------------------
passport.use('signin', 

    new LocalStrategy( 
        
        (username, password, done) => {

            User.findOne({ email: username }, function (err, user) {
                
                //比對加密密碼
                let isValidPassword = function (user, password) {
                    return bcrypt.compareSync(password, user.password)
                }

                if (err) { return done(err); }

                if (!user) { 

                    console.log('no user');
                    return done(null, false); 
                }else if (!isValidPassword(user, password)) {
                    console.log('user.password:',user.password,' password:',password); 
                    return done(null, false); 
                }
                
                return done(null, user);
            });
        }
));


passport.use('signup', 

    new LocalStrategy( 

        (username, password, done) => {

            User.findOne({email: username}).then((currentUser) => {

                if(currentUser){
                    return done(null, false);
                }else{
                    
                    //加密密碼
                    new User({
                        username: username,
                        email:username,
                        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
                        active:false
                    }).save().then((newUser) => {

                        console.log('> created new user: ', newUser);

                        //send varify email to new user
                        Mailer(newUser.email, newUser._id);
                        done(null, newUser);
                    });
                }
            });
        })
);


// GoogleStrategy --------------------------------
passport.use(

    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: 'https://0f393789.ngrok.io/auth/google/redirect'   //when use ngrok
        //callbackURL: 'http://127.0.0.1:3000/auth/google/redirect'     //when use local

    }, (accessToken, refreshToken, profile, done) => {
        
        // check if user already exists in our own db
        // console.log('profile: ',profile);

        User.findOne({email: profile.emails[0].value}).then((currentUser) => {
            if(currentUser){
                // already have this user
                currentUser.username = profile.displayName;
                currentUser.googleId =  profile.id;
                currentUser.thumbnail =  profile._json.image.url;
                currentUser.active = true;

                currentUser.save().then((newUser) => {
                    console.log('> user is: ', currentUser);
                    done(null, currentUser);
                });

            } else {
                // if not, create user in our db
                new User({
                    username: profile.displayName,
                    email:profile.emails[0].value,
                    active:true,
                    googleId: profile.id,
                    thumbnail: profile._json.image.url
                }).save().then((newUser) => {
                    console.log('> created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);


// FacebookStrategy --------------------------------      //notyet
passport.use(
    
    new FacebookStrategy({
        // options for google strategy
        clientID: keys.facebook.clientID,
        clientSecret: keys.facebook.clientSecret,
        //callbackURL: 'https://localhost:3000/auth/facebook/redirect'   //when use local
        callbackURL: 'https://0f393789.ngrok.io/auth/facebook/redirect',  //when use ngrok
        profileFields: ['id', 'displayName', 'photos', 'emails']
    }, (accessToken, refreshToken, profile, done) => {
        
        // check if user already exists in our own db
        console.log('profile: ', profile);




    })
);

// TwitterStrategy --------------------------------
passport.use(
    
    new TwitterStrategy({
        // options for twitter strategy
        consumerKey: keys.twitter.clientID,
        consumerSecret: keys.twitter.clientSecret,
        //callbackURL: 'http://127.0.0.1:3000/auth/twitter/redirect',     //when use local
        callbackURL: 'https://0f393789.ngrok.io/auth/twitter/redirect',  //when use ngrok
        includeEmail: true
    }, (accessToken, refreshToken, profile, done) => {

         console.log('profile.emails: ',profile.emails);

        User.findOne({email: profile.emails[0].value}).then((currentUser) => {
            if(currentUser){
                // already have this user      
                currentUser.username = profile.displayName;
                currentUser.twitterId =  profile.id;
                currentUser.thumbnail =  profile._json.profile_image_url;
                currentUser.active = true;

                currentUser.save().then((newUser) => {
                    console.log('> user is: ', currentUser);
                    done(null, currentUser);
                });
                
            } else {
                // if not, create user in our db
                new User({
                    username: profile.displayName,
                    email:profile.emails[0].value,
                    active:true,
                    twitterId: profile.id,
                    thumbnail: profile._json.profile_image_url
                }).save().then((newUser) => {
                    console.log('> created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });

    })
)