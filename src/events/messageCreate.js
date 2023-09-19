const Discord = require('discord.js')

module.exports.name = "messageCreate"

module.exports.execute = async (client, message) => {
  if (message.author.bot) return;
  let prefix = '!'

if (!message.content.startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).split(/ +/g);
  const commandName = args.shift().toLowerCase()

  let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(commandName))
  if (!command) return;
  
  try {
   await command.execute(client, message, args)
 }
  catch (error) {
    console.log(error)
  }
}
  