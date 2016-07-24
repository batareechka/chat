function init() {	

	var userMessage = $('.user-message'),
			userName = $('.user-name'),
			messages = $('.messages-list'),
			sendBtn = $('.send-btn');	


	sendBtn.on('click', sendMessage);

	userMessage.on('keydown', function() {
		if(event.which === 13 && event.shiftKey === false) {
			event.preventDefault();
			sendMessage();			
		}					
	});

	var getData = function() {

		$.getJSON('/messages', function(data) {
			messages.html('');
			for(var i in data){
				if(data.hasOwnProperty(i)) {
					messages.append($('<div>').text(data[i].name + ': ' + data[i].message));
				}
			}
		});
	};
	getData();

	setInterval(function() {
		getData();
	}, 1500);

	function sendMessage() {
		var data = {
				name: userName.val() || 'Mister X',
				message: userMessage.val()
			};
			userMessage.val('');

			$.post('/messages', data);
	}

}