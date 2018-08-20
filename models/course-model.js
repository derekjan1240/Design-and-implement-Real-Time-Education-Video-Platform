const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseName:     String,
    courseType:     String,
    courseAbout: 	String,
    coursePath:     String,
    courseTotalEp:  Number,    //總集數
    coursePay:{
        type: String,
        default: 'Free'
    },
    courseTeacher:  String
});

const Course = mongoose.model('course', courseSchema);

module.exports = Course;