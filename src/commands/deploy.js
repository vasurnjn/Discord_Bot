module.exports.info = {
  name: 'deploy',
  description: "Deploy slash commands",
  cooldown: 1,
  usage: ['option']
}

const Discord = require('discord.js')
const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');

module.exports.execute = async (client, message, args, send) => {

  if (message.author.id !== '485885170080022556') return message.reply('Stop trying an owner-only command.')

  if (args[0] && args[0].toLowerCase() === '--delete-global') {
    await client.application.commands.set([])
    send(message, ":white_check_mark: Deleted all global slash commands!")
  } else if (args[0] && args[0].toLowerCase() === '--delete') {
    await message.guild.commands.set([])
    send(message, ":white_check_mark: Deleted all slash commands from this server!")
  } else {

    let commandsObject = []
    let local = true
    if (args[0] && args[0].toLowerCase() === '--global') local = false

    const commonArgs = { "user": "User", "role": "Role", "amount": "Integer", "number": "Integer", "avatar": "User", "channel": "Channel", "member": "User" }

    let guild = message.guild
    if (args[0] && args[0].toLowerCase() === '--global') {
      guild = client.application
      send(message, "Adding slash commands to all current guilds... this can take up to an hour")
    }

    const checkChoices = (arg) => {
      if (arg === 'self-roles') return [{name: "Create", value: "create"}, {name: "Reset", value: 'reset'}]
        else if (arg === 'btt-or-ttb') return [{name: "Text to Binary", value: "ttb"}, {name: "Binary to Text", value: 'btt'}]
          else if (arg === 'heads-or-tails') return [{name: "Heads", value: "heads"}, {name: "Tails", value: 'tails'}]
      else return null;
    }
    const desc = (arg) => {
      if (arg === 'username') return "Username"
      else if (arg === 'command') return "Command or module name"
      else if (arg === 'song') return "Song name or link"
      else if (arg === 'bet') return "Amount to bet"
      else return arg
    }

    client.commands.filter(c => c.info.module !== 'image').map(c => {
      if (c.info.contextMenu) commandsObject.push({ name: (local ? c.info.name + '-t' : c.info.name), type: ApplicationCommandType.User })
      commandsObject.push({
        name: (local ? c.info.name + '-t' : c.info.name),
        description: c.info.description || null,
        options: c.info.options ? c.info.options : (c.info.usage ? c.info.usage.map(arg => {
          let required = true
          if (arg.startsWith("_")) {
            required = false
            arg = arg.replace("_", "")
          }
          return { name: arg.toLowerCase(), description: desc(arg.toLowerCase()), autocomplete: (['command', 'username', 'user'].includes(arg) || c.info.autocomplete ? true : false), choices: checkChoices(arg), type: (commonArgs[arg] ? ApplicationCommandOptionType[commonArgs[arg]] : ApplicationCommandOptionType.String), required: required }
        }) : null),
        defaultMemberPermissions: c.info.permissions ? c.info.permissions[0] : null
      })
    })

    const imageObject = {
      name: (local ? 'image-t' : 'image'),
      description: 'Use image commands',
      options: client.commands.filter(c => c.info.module === 'image').map(c => {
        if (c.info.contextMenu) commandsObject.push({ name: (local ? c.info.name + '-t' : c.info.name), type: ApplicationCommandType.User })
        return {
          name: c.info.name,
          description: c.info.description,
          type: ApplicationCommandOptionType.Subcommand,
          options: c.info.usage.map(arg => {
            let required = (arg.startsWith('_') ? false : true)
            arg = arg.replace("_", "")
            return { name: arg, description: `${c.info.name} ${arg}`, type: (commonArgs[arg] ? ApplicationCommandOptionType[commonArgs[arg]] : ApplicationCommandOptionType.String), required: required }
          })
        }
      }).filter(a => a.name !== 'horny'),
    }

    commandsObject.push(imageObject)

    const commands = await guild.commands.set(commandsObject)
    if (!commands) return send(message, "ERROR!")
    send(message, ":white_check_mark: Deployed slash commands " + ((args[0] && args[0].toLowerCase() === '--global') ? "globally" : "for this server") + "!")
  }
}