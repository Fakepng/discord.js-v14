const { ChatInputCommandInteraction } = require('discord.js');
const { DEVELOPERIDLIST } = process.env;
const DEVELOPERID = DEVELOPERIDLIST.split(",");

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });

        if (command.developer && !DEVELOPERID.includes(interaction.user.id)) {
            return interaction.reply({ content: 'You are not my developer!', ephemeral: true });
        }

        const subCommand = interaction.options.getSubcommand();
        if (subCommand) {
            const subCommandFile = client.subCommands.get(`${interaction.commandName}.${subCommand}`);
            if (!subCommandFile) return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            subCommandFile.execute(interaction, client);
        } else {
            command.execute(interaction, client);
        }
    }
}