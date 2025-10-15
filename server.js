const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Initialize Discord bot with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Discord bot token from environment variable
const TOKEN = process.env.DISCORD_TOKEN;

// Bot ready event
client.once('ready', () => {
  console.log(`Discord Bot Logged in as ${client.user.tag}!`);
});

// Message handling
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  if (message.content === '!ping') {
    await message.reply('Pong!');
    console.log('Responded to ping command');
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Handle the root route
app.get('/', (req, res) => {
  res.send('Active Developer Badge Service is Running');
});

// Start express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Login to Discord with your client's token
if (TOKEN) {
  client.login(TOKEN)
    .then(() => console.log('Discord bot login successful'))
    .catch(err => console.error('Discord login error:', err));
} else {
  console.error('DISCORD_TOKEN not found in environment variables');
}
