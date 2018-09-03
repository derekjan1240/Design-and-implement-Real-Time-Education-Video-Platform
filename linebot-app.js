const line = require('@line/bot-sdk');
const key = require('./config/keys');

const express = require('express');

// create Express app
const app = express();


// create LINE SDK client
const client = new line.Client(key.lineBotChannelConfig);

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/echo', line.middleware(key.lineBotChannelConfig), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => {
      res.json(result);
      //console.log('event: ', req.body.events[0]);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {

  if (event.type !== 'message' || event.message.type !== 'text') {

	// guiding msg
	let reply = { type: 'text', text: '請輸入 Menu 進入功能選單' };
	//use reply API
	return client.replyMessage(event.replyToken, reply);

    // ignore non-text-message event
    return Promise.resolve(null);

  }else{

  	//// 選單部分 ---
    // Menu 功能選單
    if(event.message.text === 'Menu' || event.message.text === 'menu'){
      //選項表單
      let menu = {
          type: "template",
          altText: "Input Key word: [Gossip][Baseball][CPBL][北宜][桃竹苗][中部][雲嘉南][高屏][東部及離島]",
          template: {
            type: "buttons",
            text: "選擇查詢目標",
            actions: [
              {
                type: "message",
                label: "綁定帳號(Binding Account)",
                text: "BA"
              },
              {
                type: "message",
                label: "pm2.5及時濃度",
                text: "pm2.5"
              },
              {
                type: "message",
                label: "CPBL個人榜",
                text: "CPBL"
              }
            ]
          } 
        }
      

      return client.replyMessage(event.replyToken, menu);

    }else{
    	//line userId
    	console.log('event..source.userId:',event.source.userId);
  		// create a text message
    	let reply = { type: 'text', text: '輸入 Menu 進入功能選單' };
    	//use reply API
    	return client.replyMessage(event.replyToken, reply);
    }
  	
  }

}

// listen on port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});