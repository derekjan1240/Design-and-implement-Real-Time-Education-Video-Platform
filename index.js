const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');

const authRoutes = require('./routes/auth-routes');
const postRoutes = require('./routes/post-routes');
const userRoutes = require('./routes/user-routes');
const videosRoutes = require('./routes/videos-routes');
const courseRoutes = require('./routes/courses-routes');
const profileRoutes = require('./routes/profile-routes');

const passportSetup = require('./config/passport-setup');

const mongoose = require('mongoose');
const keys = require('./config/keys');
const bodyParser = require('body-parser');
const Course = require('./models/course-model');

const app = express();

// set view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// set up session cookies
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/post', postRoutes);
app.use('/user', userRoutes);
app.use('/video', videosRoutes);
app.use('/course', courseRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

app.listen( process.env.PORT || 3000, () => {
    console.log('app now listening for requests on port 3000');
});