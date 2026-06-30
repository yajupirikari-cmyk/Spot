require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'kura_s',
    description: '最大速度でメッセージを連続送信します',
    integration_types: [1], // USER_INSTALL
    contexts: [0, 1, 2], // GUILD, BOT_DM, PRIVATE_CHANNEL
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('コマンドの登録を開始します...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('コマンドの登録が完了しました！');
  } catch (error) {
    console.error(error);
  }
})();
