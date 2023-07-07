const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Remove um número informado de mensagens')
    .addIntegerOption((option) => option
      .setName('quantidade')
      .setDescription('A quantidade de mensagens a serem removidas')
      .setRequired(true)
      .setMaxValue(100)
      .setMinValue(1))
    .addChannelOption((option) => option
      .setName('canal')
      .addChannelTypes(0)
      .setDescription('O canal onde as mensagens serão removidas')
      .setRequired(false)),
  run: async ({ interaction }) => {
    await interaction.deferReply();

    const quantity = interaction.options.getInteger('quantidade');
    const channel = interaction.options.getChannel('canal') || interaction.channel;

    const messages = await channel.messages.fetch({ limit: quantity + 1 });

    await channel.bulkDelete(messages);

    const answer = await interaction.channel.send({ content: `Removidas **${quantity}** mensagens do canal #**${channel.name}**.` });

    setTimeout(() => answer.delete(), 3000);
  },
};
