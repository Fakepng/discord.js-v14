const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { loadEvents } = require("../../Handlers/eventHandler");
const { loadCommands } = require("../../Handlers/commandHandler");

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reload your events/command")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((options) => 
            options
                .setName("events")
                .setDescription("Reload your events"))
        .addSubcommand((options) => 
            options
                .setName("commands")
                .setDescription("Reload your commands")),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "events": {
                loadEvents(client);
                interaction.reply({ content: "Reloaded all events" });
            } break;

            case "commands": {
                loadCommands(client);
                interaction.reply({ content: "Reloaded all commands" });
            } break;
        }
    }
}