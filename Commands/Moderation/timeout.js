const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, Guild } = require('discord.js');
const Database = require('../../Model/Infractions');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Restrict a user from sending messages for a specified amount of time.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .addUserOption((options) => options
            .setName('target')
            .setDescription('The user to restrict.')
            .setRequired(true)
        )
        .addStringOption((options) => options
            .setName('duration')
            .setDescription('The duration of the restriction.')
            .setRequired(true)
        )
        .addStringOption((options) => options
            .setName('reason')
            .setDescription('The reason for the restriction.')
            .setMaxLength(512)
        ),
        /**
         * 
         * @param {ChatInputCommandInteraction} interaction 
         */
        async execute(interaction) {
            const { options, guild, member } = interaction;

            const target = options.getMember('target');
            const duration = options.getString('duration');
            const reason = options.getString('reason') || 'No reason provided.';

            const errorArray = [];

            const errorEmbed = new EmbedBuilder()
                .setAuthor({ name: 'Could not timeout user.' })
                .setColor('Red');

            if (!target) return interaction.reply({
                embeds: [errorEmbed.setDescription('Please provide a valid user to timeout.')],
                ephemeral: true
            });

            if (!ms(duration) || ms(duration) > ms('28d')) {
                errorArray.push('Please provide a valid duration. (Max: 28 days)');
            };

            if (!target.manageable || !target.moderatable) {
                errorArray.push('The target is not manageable or moderatable.');
            };

            if (member.roles.highest.position < target.roles.highest.position) {
                errorArray.push('The target\'s highest role is higher than yours.');
            };

            if (errorArray.length) return interaction.reply({
                embeds: [errorEmbed.setDescription(errorArray.join('\n'))],
                ephemeral: true
            });

            let timeError = false;
            await target.timeout(ms(duration), reason).catch(() => timeError = true );

            if(timeError) return interaction.reply({
                embeds:[errorsEmbed.setDescription("Could not timeout user due to an uncommon error. Cannot take negative values")],
                ephemeral: true
            });

            const newInfractionObject = {
                IssuerID: member.id,
                IssuerTag: member.user.tag,
                Reason: reason,
                Date: Date.now()
            };
            
            let userData = await Database.findOne({ Guild: guild.id, User: target.id });
            if (!userData) {
                userData = await Database.create({ Guild: guild.id, User: target.id, Infractions: [newInfractionObject] });
            } else {
                userData.Infractions.push(newInfractionObject) && await userData.save();
            }

            const successEmbed = new EmbedBuilder()
                .setAuthor({ name: 'User timed out.', iconURL: Guild.iconURL() })
                .setColor('Gold')
                .setDescription([`**Target:** ${target.user.tag} (${target.id})\n**Duration:** ${duration}\n**Reason:** ${reason}\n**Issuer** ${member.user.tag}\n**Total Infractions** ${userData.Infractions.length}`, {long: true}]);

            return interaction.reply({ embeds: [successEmbed] });
        }
};