const Discord = require('discord.js')

module.exports.info = {
	name: 'cat',
	description: 'Get a random cat image!',
	aliases: ['meow', 'kitten', 'kitty'],
	cooldown: 5,
  module: "image"
}

module.exports.execute = async (client, message, args, send) => {

	const r = await client.fetch('http://thecatapi.com/api/images/get?format=src&type=png')
		if (r.status === 200) {
			const embed = new Discord.EmbedBuilder()
			.setTitle('Random Cat Image')
			.setColor(482402)
			.setImage(r.url)
			.setFooter({text: 'Powered by thecatapi'})
			message.reply({embeds: [embed]})
		} else message.reply({content: 'please try again later, no cats found'})
	.catch(e => message.reply('I found no cats near me ):'))
}