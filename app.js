var express = require('express');
var routes = require('./routes');
var C = require('./config');
var MongoStore = require('connect-mongo')(express);
var app = express();
var PORT = process.env.PORT || 5000;

app.configure(function() {
    app.use('/public',express.static(__dirname + '/public'));
    app.engine('html', require('ejs').renderFile);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.use(express.cookieParser());
    
    app.use(express.session({
      secret: 'cs secret',
      maxAge: new Date(Date.now() + (24*60*60) ),
      store: new MongoStore({ url: C.DB.url })
    }));
    app.use(express.bodyParser());
    app.use(express.logger());
    
});

app.get('/',function(req,res){
    res.render('index',{});
});

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

exports.server = app.listen(PORT, function() {
    console.log("Listening on " + PORT);
});




