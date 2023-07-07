const axios = require('axios');
const moment = require('moment');
const { CronJob } = require('cron');
const { EmbedBuilder } = require('discord.js');
const { colors } = require('../helper/constants');

const channelToSendEvent = '1126551250775851028';
// 1126544721205022730 - events
// 1126551250775851028 - teste
const cronTimer = '0/2 * * * * *';

const hellTideCrawler = async (client) => {
  const url = 'https://diablo4.life/api/trackers/helltide/list';
  const { data: { event } } = await axios.get(url);

  if (event.name && !client.helltide) {
    client.helltide = true;
    const timestamp = new Date(event.time);
    const channel = await client.channels.fetch(channelToSendEvent);
    const embed = new EmbedBuilder()
      .setURL('https://diablo4.life/trackers/helltide')
      .setImage('https://i.imgur.com/m0JUw8O.png')
      .setTitle('Helltide rolando!')
      .setColor(colors.main)
      .setDescription(`Um evento Helltide está acontecendo no mapa ${event.location}`)
      .addFields(
        { name: 'Confira o mapa', value: 'https://diablo4.life/trackers/helltide' },
        { name: 'Localização', value: event.location, inline: true },
        { name: 'Acabará às', value: moment(timestamp).format('HH[h]mm'), inline: true },
      );

    channel.send({ embeds: [embed] });
  }
  if (!event.name && client.helltide) {
    client.helltide = false;
  }
};

const helltideCron = (client) => new CronJob(
  cronTimer,
  async () => hellTideCrawler(client),
  null,
  true,
);

module.exports = helltideCron;
