const { execSync } = require("child_process");
const fetch = require("node-fetch");
const { Client, Routes, GatewayIntentBits } = require("discord.js");

const ping = {
  name: "ping",
  description: "Pings the bot and shows the latency",
};

const serverinfo = {
  name: "serverinfo",
  description: "Shows information about the server",
};

const userinfo = {
  name: "userinfo",
  description: "Shows information about a user",
  options: [
    {
      name: "user",
      description: "The user to get info about",
      type: 6, // USER type
      required: false,
    },
  ],
};

const help = {
  name: "help",
  description: "Shows all available commands",
};

const activedeveloper = {
  name: "activedeveloper",
  description: "Information about Discord Active Developer Badge",
};

const commands = [ping, serverinfo, userinfo, help, activedeveloper];
// Join the Discord for support: https://discord.gg/M5MSE9CvNM

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", () => {
  console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
  console.log(
    `📊 Serving ${client.guilds.cache.size} servers with ${client.users.cache.size} users`,
  );
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "ping") {
    interaction.reply({
      embeds: [
        {
          title: "🏓 Pong!",
          fields: [
            {
              name: "Bot Latency",
              value: `${Date.now() - interaction.createdTimestamp}ms`,
              inline: true,
            },
            {
              name: "API Latency",
              value: `${Math.round(client.ws.ping)}ms`,
              inline: true,
            },
          ],
          color: 0x00ff00,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } else if (interaction.commandName === "serverinfo") {
    const guild = interaction.guild;
    interaction.reply({
      embeds: [
        {
          title: `📊 ${guild.name} Server Info`,
          thumbnail: { url: guild.iconURL() || "" },
          fields: [
            { name: "Server Name", value: guild.name, inline: true },
            {
              name: "Member Count",
              value: guild.memberCount.toString(),
              inline: true,
            },
            {
              name: "Created",
              value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
              inline: true,
            },
            { name: "Server ID", value: guild.id, inline: true },
          ],
          color: 0x7289da,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } else if (interaction.commandName === "userinfo") {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    interaction.reply({
      embeds: [
        {
          title: `👤 ${user.username} User Info`,
          thumbnail: { url: user.displayAvatarURL() },
          fields: [
            { name: "Username", value: user.username, inline: true },
            { name: "User ID", value: user.id, inline: true },
            {
              name: "Account Created",
              value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
              inline: false,
            },
            {
              name: "Joined Server",
              value: member
                ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
                : "Not in server",
              inline: false,
            },
          ],
          color: 0x9932cc,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } else if (interaction.commandName === "help") {
    interaction.reply({
      embeds: [
        {
          title: "🤖 Bot Commands",
          description: "Here are all available commands:",
          fields: [
            {
              name: "/ping",
              value: "Shows bot and API latency",
              inline: false,
            },
            {
              name: "/serverinfo",
              value: "Displays server information",
              inline: false,
            },
            {
              name: "/userinfo [user]",
              value: "Shows user information",
              inline: false,
            },
            {
              name: "/activedeveloper",
              value: "Active Developer Badge information",
              inline: false,
            },
            { name: "/help", value: "Shows this help message", inline: false },
          ],
          color: 0xffd700,
          footer: { text: "Active Developer Badge Bot" },
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } else if (interaction.commandName === "activedeveloper") {
    interaction.reply({
      embeds: [
        {
          title: "🏆 Discord Active Developer Badge",
          description:
            "**Congratulations! Your bot interaction qualifies for the Active Developer Badge!**",
          fields: [
            {
              name: "✅ Bot Status",
              value: "Your bot is running and responding to commands!",
              inline: false,
            },
            {
              name: "🎯 Next Steps",
              value:
                "1. Wait 24 hours after using this command\n2. Visit https://discord.com/developers/active-developer\n3. Claim your badge!",
              inline: false,
            },
            {
              name: "📋 Requirements Met",
              value:
                "• ✅ Bot is active and responding\n• ✅ Slash commands are working\n• ✅ Bot has been used in a server",
              inline: false,
            },
            {
              name: "💡 Tips",
              value:
                'Make sure "Use data to improve Discord" is enabled in your Discord settings under Privacy & Safety',
              inline: false,
            },
          ],
          color: 0x5865f2,
          footer: {
            text: `Command used by ${interaction.user.username} • Active Developer Badge Bot`,
          },
          timestamp: new Date().toISOString(),
          thumbnail: { url: "https://i.imgur.com/z6jzw4C.png" },
        },
      ],
    });
  } else {
    interaction.reply("This command's response has not been added yet!");
  }
});

// Load environment variables
require('dotenv').config();

// Get bot token from environment variable
const token = process.env.DISCORD_BOT_TOKEN;

(async () => {
  if (!token) throw new Error("Please set DISCORD_BOT_TOKEN in your .env file");

  const ratelimitTest = await fetch(
    `https://discord.com/api/v9/invites/discord-developers`,
  );

  if (!ratelimitTest.ok) {
    await question(
      `Uh oh, looks like the node you're on is currently being blocked by Discord. Press the "Enter" button on your keyboard to be reassigned to a new node. (you'll need to rerun the program once you reconnect)`,
    );

    // This kills the container manager on the repl forcing Replit to assign the repl to another node with another IP address (if the ip is globally rate limited)
    //^ in short: Restarts the bot to be used again/attempted to start up again!
    execSync("kill 1");
    return;
  }

  await client.login(token).catch((err) => {
    throw err;
  });

  await client.rest.put(Routes.applicationCommands(client.user.id), {
    body: commands,
  });
  console.log(
    `✅ Registered ${commands.length} commands: ${commands.map((cmd) => cmd.name).join(", ")}`,
  );

  console.log(
    "DONE | Application/Bot is up and running. DO NOT CLOSE THIS TAB UNLESS YOU ARE FINISHED USING THE BOT, IT WILL PUT THE BOT OFFLINE.",
  );
})();