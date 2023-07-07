// Requisitos ---------------------------------------------------------------------------
require('dotenv').config();
const fs = require('node:fs');
const { Client, Collection } = require('discord.js');
const commandLoader = require('./helper/commandLoader');
const helltideCron = require('./job/listeningHelltide');

const LOAD_SLASH = process.argv[2] === 'load';

const { DISCORD_TOKEN } = process.env;

// Criando client do bot ----------------------------------------------------------------
const client = new Client({
  intents: [
    'Guilds',
    'MessageContent',
    'GuildMembers',
    'GuildBans',
    'GuildEmojisAndStickers',
    'GuildPresences',
    'GuildMessageReactions',
    'DirectMessageReactions',
  ],
});

// Commands Collection -------------------------- Configuração dos Comandos -------------
client.slashcommands = new Collection();

const commands = [];
const slashFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

slashFiles.forEach((cmd) => {
  const commandToAdd = require(`./commands/${cmd}`);
  client.slashcommands.set(commandToAdd.data.name, commandToAdd);
  if (LOAD_SLASH) commands.push(commandToAdd.data.toJSON());
});

if (LOAD_SLASH) {
  console.log('Fazendo deploy dos comandos');
  commandLoader(commands);
} else {
  // Bot Ready --------------------------------------------------------------------------
  client.on('ready', () => {
    console.log(`D4Tracker está online através de "${client.user.tag}", às ${Date(Date.now())}!`);
    client.user.setActivity('os eventos do D4!', { type: 'LISTENING' });
    client.helltide = false;

    // Bot CronJobs ---------------------------------------------------------------------
    helltideCron(client);
  });

  // Bot Interaction --------------------------------------------------------------------
  client.on('interactionCreate', (interaction) => {
    async function handleCommand() {
      if (!interaction.isCommand()) return;

      const cmd = client.slashcommands.get(interaction.commandName);
      if (!cmd) interaction.reply('Não possuo conhecimento deste comando.');

      await cmd.run({ client, interaction });
    }
    handleCommand();
  });

  // Login bot --------------------------------------------------------------------------
  client.login(DISCORD_TOKEN);
}
