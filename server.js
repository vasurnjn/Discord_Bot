var weather= require('weather-js')
const Discord = require('discord.js')
const client = new Discord.Client({
  intents: ['Guilds', 'GuildMessages', 'MessageContent']
})
const fs = require('fs')

const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const dotenv = require('dotenv')
dotenv.config()

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

(async () => {
	const readdir = require('util').promisify(fs.readdir)
	const categories = await readdir('./src/commands/')
	categories.forEach(category => {
		if (category.endsWith('.js')) return;
		const commandFiles = fs.readdirSync(`./src/commands`).filter(file => file.endsWith('.js'))
		for (const file of commandFiles) {
			const command = require(`./src/commands/${file}`)
			if (!command || !command.info || !command.info.name || !command.execute) console.log('[Crysto] Error in file ' + file + '! File not loaded.')
			client.commands.set(command.info.name, command)
		}
		client.modules.push(category)
		console.log(`[Crysto] Loaded ${category} commands`)
	})
})()

client.login(process.env.BOT_TOKEN)