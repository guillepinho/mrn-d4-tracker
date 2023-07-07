const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Retorna o tempo de resposta entre o servidor e o bot'),
  run: async ({ client, interaction }) => {
    const now = Date.now();
    const interactionTime = interaction.createdTimestamp;
    const response = (now - interactionTime) / 10;
    let ping = Math.ceil(client.ws.ping);

    if (ping < 0) ping = 0;

    return interaction.reply(`O ping é de **${ping}**ms e o tempo de resposta do servidor é de **${response}**ms`);
  },
};
