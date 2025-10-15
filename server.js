const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Discord bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Discord bot token from environment variable
const TOKEN = process.env.DISCORD_TOKEN;

// Bot event handlers
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
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
    .then(() => console.log('Discord bot logged in successfully'))
    .catch(err => console.error('Discord login error:', err));
} else {
  console.error('DISCORD_TOKEN not found in environment variables');
}
