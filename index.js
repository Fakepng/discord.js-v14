require("dotenv").config();

const { TOKEN, DATABASE } = process.env;

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require('./Handlers/eventHandler');

client.events = new Collection();
client.subCommands = new Collection();
client.commands = new Collection();

const { connect } = require('mongoose');
connect(DATABASE, {

}).then(() => {
    console.log('Client connected to database');
})

loadEvents(client);

client.login(TOKEN)
