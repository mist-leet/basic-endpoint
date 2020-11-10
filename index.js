const express = require('express');
const request = require('request');

const port = process.env.PORT || 4444;
const app = express();

app.use(express.json());

function makeRequest(url, data) {
	console.log(`Making request with ${JSON.stringify(data)} to ${url}`)
	request.post(url, {json: data}, (err, res, body) => {
		if (err) {
			console.error(err);
			return;
		}
	});
}

function getRequestContent(receivedContent) {
	switch (receivedContent) {
		case 'link':
			return 'click this [test link](https://link.com/test)!';

		case 'bold':
			return 'this is the **bold text**)'

		case 'italic':
			return 'here is _italic text_'

		case 'list':
			return 'You need to see this\n* item1\n* item2\n* item3\n'

		case 'new_line':
			return 'test text\nnew line'

		default:
			return `Hello from STC stub!\nU said: ${receivedContent}`;
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
}

app.post('/', (req, res) => {
	console.log(`Got request body: ${JSON.stringify(req.body)}`)
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

	res.status(200).send('Hello from STC stub!');
	makeRequest(replyTo, replyBody);
});

var a = 0;

app.post('/check', (req, res) => {
	a += 1;
	if (a % 3 == 0) {
		res.status(500).send('bad');		
	}
	console.log(`Got request body: ${JSON.stringify(req.body)}`)
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

	res.status(200).send('CHECK');
	makeRequest(replyTo, replyBody);
});

app.listen(port, () => console.log(`App is available on localhost: ${port}`));
