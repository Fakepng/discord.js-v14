const { ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, Client } = require('discord.js');
const { loadCommands } = require('../../Handlers/commandHandler');
const { loadEvents } = require('../../Handlers/eventHandler');

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reloads a commands/events')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) => options
            .setName('events')
            .setDescription('Reloads all events')
        )
        .addSubcommand((options) => options
            .setName('commands')
            .setDescription('Reloads all commands')
        ),
        /**
         * 
         * @param {ChatInputCommandInteraction} interaction 
         * @param {Client} client 
         */
        execute(interaction, client) {
            const subCommand = interaction.options.getSubcommand();

            switch (subCommand) {
                case 'events': {
                    for (const [key, value] of client.events)
                    client.removeListener(`${key}`, value, true);
                    loadEvents(client);
                    interaction.reply({ content: 'Events reloaded!', ephemeral: true });
                } break;

                case 'commands': {
                    loadCommands(client);
                    interaction.reply({ content: 'Commands reloaded!', ephemeral: true });
                } break;
            }
        }
}