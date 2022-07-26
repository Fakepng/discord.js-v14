require("dotenv").config();

const TOKEN = process.env.TOKEN;

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const client = new Client({
        intents: [Guilds, GuildMembers, GuildMessages],
        partials: [User, Message, GuildMember, ThreadMember]
    }
);

client.commands = new Collection();

client
    .login(TOKEN)
    .then(() => {
        loadEvents(client);
        loadCommands(client);
    })
    .catch((err) => {
        console.error(err);
    })
