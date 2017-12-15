var linebot = require('linebot');
var express = require('express');
var http = require("https");
var bot = linebot({
    channelId: 'channel Id',
    channelSecret: 'channel Secret',
    channelAccessToken: 'channel Access Token'
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);
//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
    var port = server.address().port;
    console.log("App now running on port", port);
});


bot.on('message', function(event) {
    console.log(event.source.userId);
    console.log(event.message.text);

    kkbox(event);
});

function kkbox(event) {
    var msg = event.message.text;
    var kkObj;
    var QueryString;
    var QueryType;

    if (event.message.type != 'text' || msg.length < 3) { return }
    if (msg.substr(0, 1) != '#' && msg.substr(0, 2) != '點播') { return; }

    if (msg.substr(0, 1) == '#') {
        QueryType = 'artlist';
        msg = msg.substr(1);
        QueryString = '/v1.1/search?q=' + encodeURI(msg) + '&type=artist&territory=TW&offset=0&limit=10';
    }
    if (msg.substr(0, 2) == '點播') {
        QueryType = 'track';
        msg = msg.substr(2);
        QueryString = '/v1.1/search?q=' + encodeURI(msg) + '&type=track&territory=TW&offset=0&limit=10';
    }

    var options = {
        "method": "GET",
        "hostname": "api.kkbox.com",
        "port": null,
        "path": QueryString,
        "headers": {
            "accept": "application/json",
            "authorization": "Bearer YOUR ACCESS TOKEN HERE"
        }
    };

    var req = http.request(options, function(res) {
        var chunks = [];

        res.on("data", function(chunk) {
            chunks.push(chunk);
        });

        res.on("end", function() {
            var body = Buffer.concat(chunks);
            kkObj = JSON.parse(body.toString());

            if (QueryType == 'track') {
                kkReply_tracks(event, kkObj, msg);
            } else {
                kkReply_artlist(event, kkObj, msg);
            }
        });
    });

    req.end();
}

function kkReply_artlist(event, kkObj, msg) {
    var Columns = [];
    var Actions = [];

    if (kkObj.artists == undefined) { return; }

    for (var i = 0; i < kkObj.artists.data.length; i++) {
        var img = kkObj.artists.data[i].images[1].url;
        var title = kkObj.artists.data[i].name.substr(0, 39); //Max 40 Length;
        var text = ' '; //Max 60 Length
        var url = kkObj.artists.data[i].url;

        Actions[i] = new kkboxActions('uri', '播放', url);
        Columns[i] = new kkboxColumns(img, title, text, [Actions[i]]);
    }

    event.reply({
        type: 'template',
        altText: msg,
        template: {
            type: 'carousel',
            columns: Columns
        }
    });
}

function kkReply_tracks(event, kkObj, msg) {
    var Columns = [];
    var Actions = [];

    if (kkObj.tracks == undefined) { return; }

    for (var i = 0; i < kkObj.tracks.data.length; i++) {
        var img = kkObj.tracks.data[i].album.images[1].url;
        var title = (kkObj.tracks.data[i].name).substr(0, 39); //Max 40 Length
        var text = (kkObj.tracks.data[i].album.name).substr(0, 59); //Max 60 Length
        var url = kkObj.tracks.data[i].url;

        Actions[i] = new kkboxActions('uri', '播放', url);
        Columns[i] = new kkboxColumns(img, title, text, [Actions[i]]);
    }

    event.reply({
        type: 'template',
        altText: msg,
        template: {
            type: 'carousel',
            columns: Columns
        }
    });
}

function kkboxColumns(thumbnailImageUrl, title, text, actions) {
    this.thumbnailImageUrl = thumbnailImageUrl;
    this.title = title;
    this.text = text;
    this.actions = actions;
}

function kkboxActions(type, label, uri) {
    this.type = type;
    this.label = label;
    this.uri = uri;
}