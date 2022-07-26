function loadCommands(client) {
    const ascii = require("ascii-table");
    const fs = require("fs");
    const table = new ascii().setHeading("Commands", "Status");
    
    let commandsArray = [];
    let developerArray = [];

    const commandsFolder = fs.readdirSync("./Commands");
    for (const folder of commandsFolder) {
        const commandFiles = fs
            .readdirSync(`./Commands/${folder}`)
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const commandFile = require(`../Commands/${folder}/${file}`);

            client.commands.set(commandFile.data.name, commandFile);

            if (commandFile.developer) {
                developerArray.push(commandFile.data.toJSON());
            } else {
                commandsArray.push(commandFile.data.toJSON());
            }
            
            table.addRow(file, "🟢🟢🟢");
            continue;
        }
    }

    client.application.commands.set(commandsArray);

    const developerGuild = client.guilds.cache.get(process.env.DEVELOPERGUILD)

    developerGuild.commands.set(developerArray);

    return console.log(table.toString(), "\nLoaded all commands");
}

module.exports = { loadCommands };