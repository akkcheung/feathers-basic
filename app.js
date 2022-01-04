const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')

//heroku
const PORT = process.env.PORT || 3030

class MessageService {
	constructor(){
		this.messages = []
	}

	async find () {
		return this.messages
	}

	async create (data) {

		const message = {
			id : this.messages.length,
			text: data.text
		}

		this.messages.push(message)

		return message
	}
}

const app = express(feathers());

// parse http json bodies
app.use(express.json())

// parse url-encoded params
app.use(express.urlencoded({ extended: true }))

// host static files from the current folder
app.use(express.static(__dirname))

// Add  REST API support
app.configure(express.rest())

// configure socket.io real-time APIs
app.configure(socketio())

app.use('/messages', new MessageService())

app.use(express.errorHandler())

// add any real-time connection to everybody channel
app.on('connection', connection =>
	app.channel('everybody').join(connection)
)

app.publish(data => app.channel('everybody'))

app.listen(PORT).on('listening', () =>
	console.log('Feathers server listening on localhost:3030')
)

app.service('messages').create({
	text: 'hello world from the server'
})

/*

app.service('messages').on('created', message => {
	console.log('A new message has been created', message)
})

const main = async() => {
	await app.service('messages').create({
		text: 'hello Feathers'
	})

	await app.service('messages').create({
		text: 'hello again'
	})

	const messages = await app.service('messages').find()

	console.log('All messages', messages)
}

main()

*/
