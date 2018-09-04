const line = require('@line/bot-sdk');
const mongoose = require('mongoose');
const User = require('./models/user-model');
const key = require('./config/keys');

const express = require('express');

// create Express app
const app = express();
app.use(express.static('public'));

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
	console.log('event.message.text:', event.message);
	console.log('event: ', event.source.userId);
	console.log('User',User);
	User.findOne({lineId: "Ub863d96349c4b14af06e363534150c60"}).then((currentUser) => {

		console.log(currentUser);

	})

   //  User.findOne({lineId: event.source.userId}).then((currentUser) => {
   //   	console.log('222222');
   //      if(currentUser){
   //      	console.log('會員已經綁定line帳號');
   //      	/*會員已經綁定line帳號*/

   //          if (event.type !== 'message' || event.message.type !== 'text') {
            	
   //          	/* 接收到非文字訊息時 */

			// 	// Guiding msg
			// 	let reply = { type: 'text', text: '請輸入 Menu 進入功能選單' };
			// 	//use reply API
			// 	return client.replyMessage(event.replyToken, reply);

			//   }else{
		 
			//   	/* 接收到文字訊息時 */

			//     // Menu 功能選單
			//     if(event.message.text === 'Menu' || event.message.text === 'menu'){

			// 		//設定回應內容
		 //            let reply = {
			// 		  	"type": "template",
			// 		  	"altText": "Input Key word:",
			// 			"template": {
			// 				"type": "buttons",
			// 				"thumbnailImageUrl": "https://gdurl.com/1JRA",
			// 		        "imageAspectRatio": "rectangle",
			// 		        "imageSize": "cover",
			// 		        "imageBackgroundColor": "#FFFFFF",
			// 		        "title": "Course BOT",
			// 		        "text": "Please select",
			// 				"defaultAction": {
			// 				    "type": "uri",
			// 			        "label": "View detail",
			// 			        "uri": "https://cbfde966.ngrok.io"
			// 				},
			// 			    "actions": [
			// 			    	{
			// 			            "type": "uri",
			// 			        	"label": "官網",
			// 			        	"uri": "https://cbfde966.ngrok.io"
			// 			        },
			// 			    	{
			// 			  			"type": "uri",
			// 			            "label": "綁定帳號",
			// 			            "uri": "https://cbfde966.ngrok.io/auth/line"
			// 			    	}
			// 			    ]
			// 			}
			// 		}

			//     	return client.replyMessage(event.replyToken, reply);

			//     }


			//     // key words
			//     else if(event.message.text === 'Menu' || event.message.text === 'menu'){

			//     }

			//     // Guiding msg
			//     else{
			    	
			//   		// create a text message
			//     	let reply = { type: 'text', text: '輸入 Menu 進入功能選單' };
			//     	//use reply API
			//     	return client.replyMessage(event.replyToken, reply);
			//     }
		  	
		 //  	}

   //      }else{
   //      	console.log('會員還未綁定line帳號');
   //      	/*會員還未綁定line帳號*/

   //      	//設定回應內容
   //          let reply = {
			//   	"type": "template",
			//   	"altText": "Input Key word:",
			// 	"template": {
			// 		"type": "buttons",
			// 		"thumbnailImageUrl": "https://gdurl.com/1JRA",
			//         "imageAspectRatio": "rectangle",
			//         "imageSize": "cover",
			//         "imageBackgroundColor": "#FFFFFF",
			//         "title": "Course BOT",
			//         "text": "Please select",
			// 		"defaultAction": {
			// 		    "type": "uri",
			// 	        "label": "View detail",
			// 	        "uri": "https://cbfde966.ngrok.io"
			// 		},
			// 	    "actions": [
			// 	    	{
			// 	            "type": "uri",
			// 	        	"label": "官網",
			// 	        	"uri": "https://cbfde966.ngrok.io"
			// 	        },
			// 	    	{
			// 	  			"type": "uri",
			// 	            "label": "綁定帳號",
			// 	            "uri": "https://cbfde966.ngrok.io/auth/line"
			// 	    	}
			// 	    ]
			// 	}
			// }

	  //     	return client.replyMessage(event.replyToken, reply);
   //      }

   //  });


}

// listen on port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});