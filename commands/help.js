const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { colors } = require('../helper/constants');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Mostra os comandos disponíveis'),
  run: async ({ interaction }) => {
    const embed = new EmbedBuilder()
      .setTitle('D4Tracker')
      .setColor(colors.main)
      .setDescription('Comandos disponíveis:')
      .addFields(
        { name: '/ping', value: 'Para verificar se estou funcionando normalmente.' },
      );

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
