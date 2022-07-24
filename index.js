require("dotenv").config();

const TOKEN = process.env.TOKEN;

const { Client, GatewayIntentBits, Partials } = require("discord.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const { loadEvents } = require("./Handlers/eventHandler");

const client = new Client({
        intents: [Guilds, GuildMembers, GuildMessages],
        partials: [User, Message, GuildMember, ThreadMember]
    }
);

client
    .login(TOKEN)
    .then(() => {
        loadEvents(client);
    })
    .catch((err) => {
        console.error(err);
    })
