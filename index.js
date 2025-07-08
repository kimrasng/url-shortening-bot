const { Client, Collection, Events, GatewayIntentBits, REST, Routes } = require('discord.js')

require('dotenv').config()

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION'
    ],
})

const ping = require('./src/commands/ping.js')

client.commands = new Collection()
client.commands.set(ping.data.name, ping)

client.once(Events.ClientReady, async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

    try {
        const commandsData = Array.from(client.commands.values()).map(command => command.data.toJSON())
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commandsData },
        )

        console.log('Global slash commands registered successfully.')
    } catch (error) {
        console.error('Error registering global slash commands:', error)
    }

})

client.on(Events.InteractionCreate, async (interaction) => {

    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
    }

})

client.login(process.env.DISCORD_TOKEN)