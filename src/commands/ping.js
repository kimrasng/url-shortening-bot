const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('지연 시간을 측정합니다.'),

    async execute(interaction) {
        await interaction.reply({ content: 'pinging...' })

        const sent = await interaction.fetchReply()
        const rtt = sent.createdTimestamp - interaction.createdTimestamp

        await interaction.editReply(`🏓 Pong!\nRTT: ${rtt}ms`)
    }
}