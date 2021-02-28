const express = require('express');
const request = require('request');

const port = process.env.PORT || 4444;
const app = express();

var mod = 1;
var enable = 1;

app.use(express.json());

function makeRequest(url, data) {
	//console.log(`Making request with ${JSON.stringify(data)} to ${url}`)
	request.post(url, {json: data}, (err, res, body) => {
		if (err) {
			console.error(err);
			return;
		}
	});
}

function getRequestContent(receivedContent) {
	if (Number(receivedContent)) {
		count = Number(receivedContent);
		s = '';
		for (var i = 0; i < count; i += 1)
		{
			s += 'Link example: [google ' + i.toString() + '|https://google.com]\n';
		}
		return s;
	}
	switch (receivedContent) {
		case 'p':
			return '[pic picachu.png]';

		case 'mix':
			return 'Какой то текст \n' + 
				   'Стикер [pic picachu.png]\n' +
				   'Кнопка ссылка [google|https://google.com]\n' +
				   'Кнопка с текстом [кнопка с текстом]\n' +
				   'какой то текст\n' +
				   'Несуществующий стикер: [pic not_found_sticker.png]\n'
		case 'mix2':
			return 'ссылка [google](https://google.com)\n' +
				'this is the **bold text**\n' +
				'here is _italic text_\n' +
				'You need to see this\n* item1\n* item2\n* item3\n' +
				'test text\nnew line' 


		case 'link':
			return 'go to [google](https://google.com)';

		case 'bold':
			return 'this is the **bold text**'

		case 'italic':
			return 'here is _italic text_'

		case 'list':
			return 'You need to see this\n* item1\n* item2\n* item3\n'

		case 'new_line':
			return 'test text\nnew line'

		default:
			return 'Hello';
	}
}

function getResult(messageText) {
	switch (messageText) {
		case 'operator':
			return 'operator';
		
		case 'no_body':
			return 'operator';
	
		default:
			return 'answer';
	}
}

function addReplyBodyIfNeeded(replyBody, requestText) {
	if (requestText === 'no_body') {
		return;
	}
	replyBody['data'] = [{
		"score": "",
		"uid": "",
		"type": "text",
		"content": getRequestContent(requestText)
	}];
	console.log('message sent: ', getRequestContent(requestText));
}

function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

app.post('/', (req, res) => {
	console.log(`Got request body: ${JSON.stringify(req.body)}`);

	const {
		request_id,
		appeal_id,
		replyTo,
		request_time,
		message_number
	} = req.body;
	const requestText = req.body.data[0].content;
	const replyBody = {
		request_id, appeal_id, request_time, message_number,
		"replyTo_id": "",
		"result": getResult(requestText),
		"responce_data": {
    		"scenario_id": "omnichatadapter"
    	},
		"errors": []
	};
	addReplyBodyIfNeeded(replyBody, requestText);

	if (enable == 0)
	{
		console.log('disabled');
		return;
	}

	res.status(200).send('Hello from STC stub!');
	makeRequest(replyTo, replyBody);
});

app.post('/check', (req, res) => {
	console.log(`checking... (mod:${mod})`);
	if (randomIntInc(1, 10) <= mod || enable != 1) {
		res.status(500).send(500);
		console.log('500 sent');
	}
	else {
		res.status(200).send("ok");
		console.log('200 sent');
	}
});



app.post('/check_with_no_body', (req, res) => {
	console.log(`checking... (mod:${mod})`);
	if (randomIntInc(1, 10) <= mod) {
		res.status(500).send(500);
		console.log('500 sent');
	}
	else {
		res.status(200).send();
		console.log('200 sent');
	}
});

app.post('/toggle', (req, res) => {
	if (enable == 0)
		enable = 1;
	else
		enable = 0;

	res.status(200).send(`enable switched to ${enable}`);
});

valid_mods = ["1", "0", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

app.post('/mod/:mod', (req, res) => {
	
	if (valid_mods.includes(req.params.mod)) {
		mod = Number(req.params.mod);
		res.status(200).send(`mod: ${mod}`);
	}
	else {
		res.status(403).send(`mod: ${mod}`);	
	}
});



app.listen(port, () => console.log(`App is available on localhost: ${port}`));