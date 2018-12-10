const line = require('@line/bot-sdk');
const mongoose = require('mongoose');
const User = require('./models/user-model');
const key = require('./config/keys');

const express = require('express');

// create Express app
const app = express();
app.use(express.static('public'));

// connect to mongodb
mongoose.connect(key.mongodb.dbURI, () => {
    console.log('connected to mongodb');
});

// create LINE SDK client
const client = new line.Client(key.lineBotChannelConfig);

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/echo', line.middleware(key.lineBotChannelConfig), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {

	//line userId
	// console.log('event.message.text:', event.message);
	// console.log('event: ', event.source.userId);
	
    User.findOne({lineId: event.source.userId}).then((currentUser) => {

        if(currentUser){
        	// console.log('會員已經綁定line帳號');
        	/*會員已經綁定line帳號*/

            if (event.type !== 'message' || event.message.type !== 'text') {
            	
            	/* 接收到非文字訊息時 */

				// Guiding msg
				let reply = { type: 'text', text: '請輸入 Menu 進入功能選單' };
				//use reply API
				return client.replyMessage(event.replyToken, reply);

			  }else{
		 
			  	/* 接收到文字訊息時 */

			    // Menu 功能選單
			    if(event.message.text === 'Menu' || event.message.text === 'menu'){

					//設定回應內容
		            let reply = {
					  	"type": "template",
					  	"altText": "PC user please input the Key word: [course], [recommend], [remind]",
						"template": {
							"type": "buttons",
							"thumbnailImageUrl": "https://gdurl.com/1JRA",
					        "imageAspectRatio": "rectangle",
					        "imageSize": "cover",
					        "imageBackgroundColor": "#FFFFFF",
					        "title": "Course BOT",
					        "text": "Please select(Login First)",
							"defaultAction": {
							    "type": "uri",
						        "label": "View detail",
						        "uri": key.ngrokUrl.webUrl
							},
						    "actions": [
						    	{
						            "type": "uri",
						        	"label": "官網",
						        	"uri": key.ngrokUrl.webUrl
						        },
				                {
				               		"type": "uri",
				                	"label": "我的課程",
				                	"uri": key.ngrokUrl.webUrl + "/profile/course"
				                },
				                {
				                	"type": "message",
				                	"label": "推薦課程",
				                	"text": "recommend"
				                },
				                {
				                	"type": "message",
				                	"label": "設定提醒",
				                	"text": "remind"
				                }
						    ]
						}
					}

			    	return client.replyMessage(event.replyToken, reply);

			    }


			    // key words
			    
			   	/*else if(event.message.text === 'course' || event.message.text === 'Course'){

			    	let reply = { type: 'text', text: '進入我的課程' };
					//use reply API
					return client.replyMessage(event.replyToken, reply);

			    }*/

			    else if(event.message.text === 'recommend' || event.message.text === 'Recommend'){

			    	let reply = { type: 'text', text: '進入推薦課程' };
					//use reply API
					return client.replyMessage(event.replyToken, reply);

			    }

			    else if(event.message.text === 'remind' || event.message.text === 'Remind'){

			    	let reply = { type: 'text', text: '進入提醒設定' };
					//use reply API
					return client.replyMessage(event.replyToken, reply);

			    }

			    // Not key words
			    // Guiding msg
			    else{
			    	
			  		// create a text message
			    	let reply = { type: 'text', text: '輸入 Menu 進入功能選單' };
			    	//use reply API
			    	return client.replyMessage(event.replyToken, reply);
			    }
		  	
		  	}

        }else{
        	// console.log('會員還未綁定line帳號');
        	/*會員還未綁定line帳號*/

        	//設定回應內容
            let reply = {
			  	"type": "template",
			  	"altText": "Link Account: " + key.ngrokUrl.webUrl + "/auth/line",
				"template": {
					"type": "buttons",
					"thumbnailImageUrl": "https://gdurl.com/1JRA",
			        "imageAspectRatio": "rectangle",
			        "imageSize": "cover",
			        "imageBackgroundColor": "#FFFFFF",
			        "title": "Course BOT",
			        "text": "Please binding  your account first!",
					"defaultAction": {
					    "type": "uri",
				        "label": "官網",
				        "uri": key.ngrokUrl.webUrl
					},
				    "actions": [
				    	{
				            "type": "uri",
				        	"label": "官網",
				        	"uri": key.ngrokUrl.webUrl
				        },
				    	{
				  			"type": "uri",
				            "label": "綁定帳號",
				            "uri": key.ngrokUrl.webUrl + "/auth/line"
				    	}
				    ]
				}
			}

	      	return client.replyMessage(event.replyToken, reply);
        }

    });


}

// listen on port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});