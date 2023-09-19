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
      
  weather.find({search: 'Vellore, India', degreeType: 'C'}, function(err, result) {
  if(err) console.log(err);
 
  console.log(JSON.stringify(result, null, 2));
});
  
  
  
  
  }
  
  if (commandName === 'hello') {
        message.reply("hello")
  }
  if (commandName==='hi'){
        message.reply("hello")
  }
  if (commandName==='!info') {
        message.reply('Im a bot made by CodeCrafters')
    
  }
  if (commandName==='!help'){
  const helpEmbed = new Discord.EmbedBuilder()
  .setColor('#7e68be')
  .setDescription("https://codecrafters-hackbattle.glitch.me/")
  .addFields([{name: `:tools: Utility`, value: "Useful commands", inline: true}, 
  {name: `:customs:Moderation`, value: "Commands to be used by moderators", inline: true},
  {name: `:joy: Fun`, value: "Bored? Use these commands :)", inline: true},
  {name: `:camera: Image`, value: "Commands to generate images!", inline: true},
  {name: `:video_game: Games`, value: "Who doesn't love games?", inline: true},
  {name: `:dollar: Economy`, value: "Interact with economy in the bot", inline: true},
  {name: `:musical_note: Music`, value: "Music commands :notes:", inline: true},
  {name: `:no_entry_sign: Bot-owner`, value: "My owner's commands", inline: true},
  {name: `<:slash:873327358281650206> Other`, value: "Commands that don't fit in any other category, or I can't figure out :/", inline: true}])
  .setFooter({text: "CodeCrafters BOT", iconURL: 'https://cdn.discordapp.com/avatars/485885170080022556/73becff6645c35fbed0f51b2bd2095e0.png?size=2048'})
  message.reply({embeds:[helpEmbed]})
  }
  

  
})

client.login(process.env.BOT_TOKEN)