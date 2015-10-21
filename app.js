var express = require('express');
var routes = require('./routes');
var C = require('./config');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser  = require("cookie-parser");
var logger = require("express-logger");
var MongoStore = require('connect-mongo')(session);
var app = express();
var PORT = C.PORT;

//app.configure(function() {
    app.use('/public',express.static(__dirname + '/public'));
    app.engine('html', require('ejs').renderFile);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(cookieParser());
    
    app.use(session({
      secret: 'cs secret',
      expires: new Date(Date.now() + (24*60*60) ),
      store: new MongoStore({ url: C.DB.url })
    }));
 
    app.use(bodyParser());

    //parse raw body
    app.use(function(req, res, next) {
        var data = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) { 
            data += chunk;
        });
        req.on('end', function() {
            req.rawBody = data;
            
        });
        next();
    });
    app.use(logger());
    
//});

app.get('/',routes.mainRoot);


app.post('/api/base64/encode', routes.base64Encode);
app.post('/api/base64/decode', routes.base64Decode);

app.post('/api/request/call', routes.requestCall);
app.post('/api/request/save', routes.requestSave);
app.delete('/api/request/:id', routes.requestRemove);
app.get('/api/request/sessionList', routes.getSessionRequests);
app.get('/api/request/resetSessionList', routes.resetSessionRequests);

app.get('/api/request/:id',routes.downloadRequest);
app.get('/api/requests',routes.downloadAllRequests);


app.post('/api/randomJson', routes.produceRandomJSON);
app.get('/api/randomJson/:schemaId', routes.produceRandomJSON);

app.post('/api/requestBin/create', routes.newRequestBin);
app.get('/api/requestBin/get/:id', routes.getRequestBin);
app.get('/api/requestBin/getSession', routes.getSessionRequestBins);

/* Request BIN APIs */
app.post('/api/requestToBin/:id', routes.requestToBin);
app.get('/api/requestToBin/:id', routes.requestToBin);
app.put('/api/requestToBin/:id', routes.requestToBin);
app.delete('/api/requestToBin/:id', routes.requestToBin);
app.head('/api/requestToBin/:id', routes.requestToBin);
app.options('/api/requestToBin/:id', routes.requestToBin);
app.trace('/api/requestToBin/:id', routes.requestToBin);
//app.connect('/api/requestToBin/:id', routes.requestToBin);

/* SF Tools */
app.post('/sf/canvas/callback', routes.sfCanvasCallback);
app.get('/api/sf/canvas/details', routes.sfCanvasStatus);
app.get('/api/sf/describeGlobal', routes.sfDescribeGlobal);
app.post('/api/sf/compareSObjectsMetadata', routes.compareSObjectsMetadata);

exports.server = app.listen(PORT, function() {
    console.log("Listening on " + PORT);
});


//this is to test the server locally (https)
//http://stackoverflow.com/questions/13186134/node-js-express-and-heroku-how-to-handle-http-and-https
//creating certificates http://blog.nategood.com/client-side-certificate-authentication-in-ngi


if(C.NODE_ENV==='devSSL'){
    console.log(C.NODE_ENV);
    var fs = require('fs');
    var https = require('https');


    var options = {
      key : fs.readFileSync('./ssl/dev/server.key').toString(), 
      cert : fs.readFileSync('./ssl/dev/server.crt').toString(),
      ca:     fs.readFileSync('./ssl/dev/ca.crt').toString(),
      requestCert:        false,
      rejectUnauthorized: false
    }

    var PORT_HTTPS = '5443';
    
    https.createServer(options, app).listen(PORT_HTTPS, function () {
        console.log("Express server listening with https on port %d in %s mode", this.address().port, app.settings.env);
    });
    
    app.use(function (req, res, next) {
        res.setHeader('Strict-Transport-Security', 'max-age=8640000; includeSubDomains');
        if (!req.secure) {
            return res.redirect(301, 'https://' + req.host  + ":" + process.env.PORT + req.url);
        } else {
            return next();
            }
    });

}




