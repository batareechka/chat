var mongo = require('mongodb').MongoClient,
express = require('express'),
bodyParser = require('body-parser'),
socketio = require('socket.io');

var app = express();
var server = app.listen(8080);	
var client = socketio.listen(server);

var staticDir = __dirname + '/public/';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
	res.sendFile(staticDir + 'index.html');
});

app.get('/ajax', function(req, res) {
	res.sendFile(staticDir + 'index_ajax.html');
});

app.get('/css/style.css', function(req, res) {
	res.sendFile(staticDir + 'css/style.css');
});

app.get('/scripts/main.js', function(req, res) {
	res.sendFile(staticDir + 'scripts/main.js');
});

app.get('/scripts/main_ajax.js', function(req, res) {
	res.sendFile(staticDir + 'scripts/main_ajax.js');
});


mongo.connect('mongodb://127.0.0.1/chat', function(err, db) {
	if(err) throw err;

	var collection = db.collection('messages');	

	//выгрузка сообщений ajax
	app.get('/messages', function(req, res) {
		collection.find().limit(100).sort({_id: 1}).toArray(function(err,doc) {
			if(err) throw err;
			res.json(doc);
		});				
	});

	//отправка сообщения ajax
	app.post('/messages', function(req, res) {
		var msg = req.body;

		var name = msg.name,
				message = msg.message,
				whitespacePattern = /^\s*$/;

		if(whitespacePattern.test(name) || whitespacePattern.test(message)) {
			console.log('invalid data');
		} 
		else {
			collection.insert({name: name, message: message}, function() {
				console.log('inserted');
			});
			res.json(msg);  //вернуть пользователю сообщение
		};
	});


	client.on('connection', function(socket) {

		//выгрузка сообщений сокеты
		collection.find().limit(100).sort({_id: 1}).toArray(function(err,res) {
			if(err) throw err;
			socket.emit('output', res);
		});


		//ждёт вход. данных
		socket.on('input', function(data) {
			var name = data.name,
			message = data.message,
			whitespacePattern = /^\s*$/;

			if(whitespacePattern.test(name) || whitespacePattern.test(message)) {
				console.log('invalid data');
			} else {
				collection.insert({name: name, message: message}, function() {
					//отправка сообщений клиентам
					client.emit('output', [data]);
				});
			}					

		});
	});		

});
