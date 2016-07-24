function init() {	

	var textarea = getNode('.chat textarea'),
			chatName = getNode('.chat-name'),
			messages = getNode('.chat-messages'),
			submitBtn = getNode('.textSubmit');	

	try {
		var socket = io.connect('http://127.0.0.1:8080');

	}
	catch(e) {

	}

	if(socket !== undefined) {
				//выгрузка сообщений
				socket.on('output', function(data) {
					if(data.length) {
						for (var i = 0; i< data.length; i++){
							var message = document.createElement('div');
							message.setAttribute('class', 'chat-message');
							message.textContent = data[i].name + ': ' + data[i].message;

							messages.appendChild(message);
						}
					}
				});

				//отправка сообщений
				textarea.addEventListener('keydown', function(event) {									
					if(event.which === 13 && event.shiftKey === false) {
						event.preventDefault();
						sendMessage();
					}					
				});

				submitBtn.addEventListener('click', sendMessage);
				
			}

			function getNode(s) {
				return document.querySelector(s);
			}

			function sendMessage() {
				var name = chatName.value;	
				var data = {
					name: name,
					message: textarea.value
				};

				socket.emit('input', data);			
				textarea.value = '';			
				console.log('inserted');
			}			
		}