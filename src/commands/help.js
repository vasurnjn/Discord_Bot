module.exports.info = {
  name: 'help',
  description: 'Get help with commands/modules',
  usage: ["_command"],
  cooldown: 2,
}

module.exports.execute = async (client, message, args, send) => {
  const commands = client.commands

  const Discord = require('discord.js')
  const { ButtonStyle } = require('discord.js')
  if (!client.application.commands.cache[0]) await client.application.commands.fetch()
  let modules = client.modules

  function getCommands(categoryp) {
   let returnCommands = commands.map(command => {
    if (command.info.module === categoryp) {
     return '</' + (categoryp === 'image' ? "image ": "") + command.info.name + ':' + (categoryp === 'image' ? client.application.commands.cache.find(e => e.name === "image") : client.application.commands.cache.find(e => e.name === command.info.name).id) + '>' + ": " + command.info.description
   }
 }).filter(Boolean).join('\n')
   return returnCommands;
 }

 if (!args[0]) {
  const helpEmbed = new Discord.EmbedBuilder()
  .setColor('#7e68be')
  .setDescription("\n**For help on a specific command, Use `!help <command>`\nTo view all commands, you can type `!help all`**\nPro tip: You can use the commands faster by pressing the Up arrow key after already using a command")
  .addFields([{name: `:tools: Utility`, value: "Useful commands", inline: true}, 
  {name: `:customs:Moderation`, value: "Commands to be used by moderators", inline: true},
  {name: `:joy: Fun`, value: "Bored? Use these commands :)", inline: true},
  {name: `:camera: Image`, value: "Commands to generate images!", inline: true},
  {name: `:video_game: Games`, value: "Who doesn't love games?", inline: true},
  {name: `:dollar: Economy`, value: "Interact with economy in the bot", inline: true},
  {name: `:musical_note: Music`, value: "Music commands :notes:", inline: true},
  {name: `:no_entry_sign: Bot-owner`, value: "My owner's commands", inline: true},
  {name: `<:slash:873327358281650206> Other`, value: "Commands that don't fit in any other category, or I can't figure out :/", inline: true}])
  .setFooter({text: "CodeCrafters", iconURL: 'https://cdn.discordapp.com/avatars/485885170080022556/73becff6645c35fbed0f51b2bd2095e0.png?size=2048'})

  const extraButtons = {
    "Invite Bot": "test",
    "Vote": "test",
    "Status": "test"
  }

  let emojis = {
    "utility": "🛠️", "moderation": "🛃", "fun": "🤣", "image": "🖼️", "games": "🎮",
    "economy": "💰", "music": "🎵", "bot-owner": "🚫", "other": "873327358281650206", 
  }
  let ordered = Object.keys(emojis).map(key => key)
  if (modules.length === ordered.length) modules = ordered
    let separate = client.utils.chunk(modules, 5)
  let rows = []

  separate.forEach(r => {
    let newRow = new Discord.ActionRowBuilder()
    .addComponents(r.map(c => client.utils.createButton({label: c, id: c, emoji: client.emojis.cache.get(emojis[c]) || emojis[c]})))
    rows.push(newRow)
  })
  rows.push(new Discord.ActionRowBuilder().addComponents([Object.keys(extraButtons).map((b, val) => {
    return client.utils.createButton({label: b, url: extraButtons[b]})
  })].flat(1)))

  let msg = await send(message, {embeds: [helpEmbed], components: rows})

  const filter = (interaction) => 1 === 1
  const collector = msg.createMessageComponentCollector({filter, idle: 60000})
  collector.on('collect', async i => {
    let category = i.customId
    i.deferUpdate()
    rows.forEach(r => {
      r.components.forEach(c => {
        if (Object.keys(extraButtons).map(a => a).includes(c.data.label)) return;
        if (c.data.label === category) {
          c.data.style = ButtonStyle.Success
          c.data.disabled = true
        }
        else {
          c.data.style = ButtonStyle.Primary
          c.data.disabled = false
        }
      })
    })

    let moduleInfo = new Discord.EmbedBuilder()
    .setTitle((category.charAt(0).toUpperCase() + category.slice(1)) + " commands")
    .setDescription(await getCommands(category))
    .setColor('100255')
    return send((i.user.id === message.author.id ? msg : i), {reply: true, embeds: [moduleInfo], components: (i.user.id === message.author.id ? [rows] : []), edit: (i.user.id === message.author.id ? true : false), ephemeral: (i.user.id === message.author.id ? false : true)})

  })
  collector.on('end', () => {
    send(msg, {edit: true, components: client.utils.disableAllComponents(msg.components)})
  })
}

else if (modules.includes(args[0].toLowerCase())) {
 if (args[0].toLowerCase() === 'all') {
  let allCommands = new Discord.EmbedBuilder()
  .setColor(100255)
  .setDescription(message.client.commands.map(c => c.info.name).join(', '))
  .setFooter('The commands are shown without prefix')
  return send(message, allCommands)
}
let moduleInfo = new Discord.EmbedBuilder()
.setTitle((args[0].charAt(0).toUpperCase() + args[0].slice(1)) + " commands")
.setDescription(await getCommands(args[0].toLowerCase()))
.setColor('100255')
return send(message, moduleInfo)
}

if (args[0]) {
  const name = args[0].toLowerCase();
  let command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

  if (!command) {
   let unknownCommand = new Discord.EmbedBuilder()
   .setColor(633333)
   .setDescription('"' + args[0] + '" command/module was not found.')
   return send(message, unknownCommand)
 }
 command = command.info
 const data = []
 data.push(`[**Command:** ${command.name}]`);
 if (command.description) data.push(`**Description:** ${command.description}`)
  if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`)
    if (command.usage) data.push(`**Usage:** /c ${command.name} ${command.usage.map(p => (p.startsWith("_") ? `[${p.replace("_", "")}]` : `<${p}>`)).join(" ")}`)
      if (command.cooldown) data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)
        if (command.permissions) data.push(`**Permissions required:** \`${command.permissions.map(p => p).join("`, `")}\``)
          const help = new Discord.EmbedBuilder()
        .setColor('100255')
        .setTitle(`Command Info`)
        .setDescription(data.join("\n"))
        .setFooter({text:'Command\'s module: ' + command.module})
        send(message, help)
      }
    }