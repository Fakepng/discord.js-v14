require("dotenv").config();

const { TOKEN } = process.env;

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require('./Handlers/eventHandler');

client.events = new Collection();

loadEvents(client);

client.login(TOKEN)
    // .then(() => {
    //     console.log(`Client logged in as ${client.user.username}`);
    //     client.user.setActivity(`with ${client.guilds.cache.size} guild(s)`);
    // })
    // .catch((err) => console.error(err));
