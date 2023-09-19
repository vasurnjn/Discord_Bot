
const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')

const express = require('express')
const app = express()
const port = 3000
const path = require('path');


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

client.on('message', message => {
  
  (async () => {
	const readdir = require('util').promisify(fs.readdir)
7	const categories = await readdir('./src/commands/')
	categories.forEach(category => {
		if (category.endsWith('.js')) return;
		const commandFiles = fs.readdirSync(`./src/commands/${category}/`).filter(file => file.endsWith('.js'))
		for (const file of commandFiles) {
			const command = require(`./src/commands/${category}/${file}`)
			if (!command || !command.info || !command.info.name || !command.execute) console.log('[Crysto] Error in file ' + file + '! File not loaded.')
				command.info.module = category
			client.commands.set(command.info.name, command)
		}
		client.modules.push(category)
		console.log(`[Crysto] Loaded ${category} commands`)
	})
})()

  

  
})