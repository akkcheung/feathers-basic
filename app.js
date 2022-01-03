const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const socketio = require('@feathersjs/socketio')


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


const app = feathers();

app.use('messages', new MessageService())

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
