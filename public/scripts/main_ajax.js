function init() {	

	var textarea = $('.chat textarea'),
	chatName = $('.chat-name'),
	messages = $('.chat-messages'),
	nameBtn = $('.nameButton'),
	submitBtn = $('.textSubmit');

	var userName;
	nameBtn.click(function() {
		userName = chatName.val() || 'MisterX';
	});

	submitBtn.on('click', sendMessage);

	textarea.on('keydown', function() {
		if(event.which === 13 && event.shiftKey === false) {
			event.preventDefault();
			sendMessage();			
		}					
	});

	var getData = function() {

		$.getJSON('/messages', function(msg) {
			messages.html('');
			for(var i in msg){
				if(msg.hasOwnProperty(i)) {
					messages.append($('<div>').text(msg[i].name + ': ' + msg[i].message));
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
				name: chatName.val() || 'MisterX',
				message: textarea.val()
			};
			textarea.val('');

			$.post('/messages', data);
	}

}