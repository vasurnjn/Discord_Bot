const Discord = require('discord.js')

module.exports.info = {
	name: 'dog',
	description: 'Get a random dog image!',
	aliases: ['woof', 'doggy', 'puppy', 'pup'],
	cooldown: 5
}

const fetch = require('node-fetch')

module.exports.execute = async (client, message, args, send) => {
	const r = await fetch('https://random.dog/woof.json')
	const response = await r.json()
		if (response) {	
			const embed = new Discord.EmbedBuilder()
			.setTitle('Random Dog Image')
			.setColor(482402)
			.setImage(response.url)
			message.reply({embeds:[embed]})
		} else {
			return message.reply('I couldn\'t find dog pics :(')
		}
}
