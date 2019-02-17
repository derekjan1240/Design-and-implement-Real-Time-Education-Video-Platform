# Design and implement Real-Time Education Video Platform
 This is a course project in NTUT
 
## About
Node JS server (Express + EJS + Bootstrap + Mlab)  
Use Node JS to create the education video platform with Member system, Shopping-cart system, LineBot and WebRTC streaming.

## Systems
#### Member system
Use passport.js to implement login and register with Local & OAth2.0(line, google+) strategy.
Use bcrypt to encryption password and save in DB.
Activate account by the verification letter.
Use RESTful API to modify the member info.

#### Shopping-cart system system
Implementation with the API.

#### LineBot
Implementation with the LineSDK.
Use to broadcast message to members and supply member to look up owned course or find courses. 

### WebRTC streaming
Implementation the live video broadcast and p2p streaming.

## Usage
using the following command: 
Web server
> node index (server running on port 3000) <br>
Bot server
> node linebot-app (server running on port 4000) <br>
WebRTC server
> clone webRTC-practice repository

## Demo
[Demo on Youtube](https://www.youtube.com/playlist?list=PLvQTpj5bUz6apVXAZuU5NoOENbFryLMqR)

<hr>

# 即時教學影音平台之設計與實作
  台北科大實務專題課程作品
  
## 關於
Node JS server (Express + EJS + Bootstrap + Mlab)  
使用 Node JS 來打造一個具有會員系統、購物車系統、Line機器人和直播視訊功能的線上影音教育平台。

## 系統
#### 會員系統
使用 passport.js 來實現本地端和第三方軟體的會員註冊和登入。
使用 bcrypt 演算法來作DB會員密碼的加密。
透過系統寄發的驗證信來激活帳號。
使用 RESTful API 提供會員對帳號資訊的修改的功能。

#### 購物車系統
透過 RESTful API 來達成購買課程、結帳等功能。

#### Line機器人系統
使用 LineSDK
用來推播亭臺課程資訊和提供會員查詢自己的課程和平台其他課程。

### 直播視訊系統
透過 WebRTC 來實作直播和一對一的視訊。

## 使用方式
輸入下列來指令來執行: 
網頁伺服器
> node index (server running on port 3000) <br>
LineBot伺服器
> node linebot-app (server running on port 4000) <br>
WebRTC伺服器
> clone webRTC-practice repository

## Demo 影片
[Demo on Youtube](https://www.youtube.com/playlist?list=PLvQTpj5bUz6apVXAZuU5NoOENbFryLMqR)
  
