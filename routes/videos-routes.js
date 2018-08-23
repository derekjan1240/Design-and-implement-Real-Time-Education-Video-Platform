const Course = require('../models/course-model');
const fs = require('fs');
const path = require('path');
const router = require('express').Router();



//影片封包
router.get('/:courseName/:coursrEp', function(req, res, next){

	const path = 'videos/' + req.params.courseName + '/' + req.params.coursrEp +'.mp4'
	const stat = fs.statSync(path)
	const fileSize = stat.size
	const range = req.headers.range

	//console.log('\n');
	//console.log('fileSize: ', fileSize);
	
	if (range) {

		const parts = range.replace(/bytes=/, "").split("-");

		const start = parseInt(parts[0], 10)
		const end = parts[1]
		  ? parseInt(parts[1], 10)
		  : fileSize-1

		//console.log('start:',start,'end:',end);  

		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end})

		const head = {
		  'Content-Range': `bytes ${start}-${end}/${fileSize}`,
		  'Accept-Ranges': 'bytes',
		  'Content-Length': chunksize,
		  'Content-Type': 'video/mp4',
		}

		//console.log('head:',head);

		res.writeHead(206, head)
		file.pipe(res)
	} else {
		const head = {
		  'Content-Length': fileSize,
		  'Content-Type': 'video/mp4',
		}
		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}

});



//管理員上傳課程影片 歸類課程路徑上傳資料庫
router.post('/upload', function(req, res){

    Course.findOne({courseName: req.body.courseName}).then((newCourse) => {

        if(newCourse){
            //已有該課程
            console.log('> The course is exist: ', newCourse);

        }else{
            
            //新增課程
            new Course({

                courseName:     req.body.courseName,
                courseType:     req.body.courseType,
                courseAbout: 	req.body.courseAbout,
                coursePath:     req.body.coursePath,
                courseTotalEp:  req.body.courseTotalEp,    //總集數
                coursePay: 	    req.body.coursePay,	       //免費是否	
                courseTeacher:  req.body.courseTeacher

            }).save().then((newCourse) => {
                console.log('> created new course: ', newCourse);
                res.json(newCourse);
            });
        }
    });

});

module.exports = router;