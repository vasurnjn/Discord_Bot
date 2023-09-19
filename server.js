
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

client.on('messageCreate', message => {
  
  let msg = message.content
  if (message.author.bot) return;
  let prefix = 'c!'

  let args = message.content.slice(prefix.length).split(/ +/g);
  const commandName = args.shift().toLowerCase()
  
  if (commandName === 'info') {
    message.reply("TEST")
  }
  if (commandName === 'weather') {
    
  }
  

  
})

client.login(process.env.BOT_TOKEN)