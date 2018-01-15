# Line Chatbot
使用 Node.js 建立 Line機器人呼叫 KKBOX open API

## Todolist

+ A little side project
+ 單純順手筆記紀錄一下

### 1. 註冊LINE＠

- Sign up [LINE＠](https://entry-at.line.me/)
- [LINE Messaging API](https://github.com/boybundit/linebot)
- [Developer Documents ](https://developers.line.me/en/docs/#messaging-api)

### 2. 註冊 Developer kkbox

- Creat new app [Developer kkbox]( https://developer.kkbox.com/)
- 取得 Client id and Client secret
- 獲取 access token
```
curl -u "client_id:client_secret" --data-urlencode "grant_type=client_credentials" https://account.kkbox.com/oauth2/token
```
- 取得token後，即可從KKBOX API取得資料

<img src="https://i.imgur.com/FrCJRqul.jpg" width="50%">

### 3. 部屬環境

- Sign up [Heroku](https://www.heroku.com/)

+ Create a Heroku app

Install the Heroku CLI
```
$ heroku login
```
Clone the repository
```
$ heroku git:clone -a linebot
$ cd linebot
```
Deploy your changes
```
$ git add .
$ git commit -am "make it better"
$ git push heroku master
```

> 詳細過程可以參考 [LINE BOT 實戰](http://www.oxxostudio.tw/articles/201701/line-bot.html)

## Demo


[KKBOX Open API Document](https://developer.kkbox.com/)

```
    search track  => 點播我難過
    search artist => #林俊傑
```

### 1. Search by track

```
var http = require("https");

var options = {
  "method": "GET",
  "hostname": "api.kkbox.com",
  "port": null,
  "path": "/v1.1/search?q=encodeURI(我難過)&type=track&territory=TW&offset=0&limit=10",
  "headers": {
    "accept": "application/json",
    "authorization": "Bearer YOUR ACCESS TOKEN HERE"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.dir(JSON.parse(body.toString()));
  });
});

req.end();
```

<img src="https://i.imgur.com/oujpcTa.jpg" width="50%">

### 2. Search by artist

```
var http = require("https");

var options = {
  "method": "GET",
  "hostname": "api.kkbox.com",
  "port": null,
  "path": "/v1.1/search?q=encodeURI(林俊傑)&type=artist&territory=TW&offset=0&limit=10",
  "headers": {
    "accept": "application/json",
    "authorization": "Bearer YOUR ACCESS TOKEN HERE"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.dir(JSON.parse(body.toString()));
  });
});

req.end();
```

<img src="https://i.imgur.com/bsy3jh4.jpg" width="50%"><br><br>



**Linebot reply 需注意**
+ Carousel template Array of columns Max: 10
+ Title Max: 40 characters
+ Message text Max: 120 characters (no image or title) Max: 60 characters (message with an image or title)
+ Action when tapped Max: 3
