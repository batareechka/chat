function init() {	

	var userMessage = getNode('.user-message'),
			userName = getNode('.user-name'),
			messages = getNode('.messages-list'),
			sendBtn = getNode('.send-btn');	

	try {
		var socket = io.connect('http://127.0.0.1:8080');

	}
	catch(e) {

	}

	if(socket !== undefined) {
				//выгрузка сообщений
				socket.on('output', function(data) {
					if(data.length) {
						// for (var i = 0; i< data.length; i++){
							for(var i in data){
								if(data.hasOwnProperty(i)){
							var messageItem = document.createElement('div');
							messageItem.setAttribute('class', 'message-item');
							messageItem.textContent = data[i].name + ': ' + data[i].message;

							messages.appendChild(messageItem);
						}
					}
					}
				});

				//отправка сообщений
				userMessage.addEventListener('keydown', function(event) {									
					if(event.which === 13 && event.shiftKey === false) {
						event.preventDefault();
						sendMessage(socket, userName, userMessage);
					}					
				});

				sendBtn.addEventListener('click', sendMessage(socket, userName, userMessage));
				
			}
								
		}

		function getNode(s) {
			return document.querySelector(s);
		}

		function sendMessage(socket, userName, userMessage) {
			var data = {
				name: userName.value || "Mister X",
				message: userMessage.value
			};

			socket.emit('input', data);			
			userMessage.value = '';			
		}	