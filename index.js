require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

// ==========================================
// 1. Expressダミーサーバーのセットアップ (Render対策)
// ==========================================
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Discord Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Dummy web server listening on port ${PORT}`);
});

// ==========================================
// 2. Discord Botのセットアップ (User App)
// ==========================================
const client = new Client({
    intents: [GatewayIntentBits.Guilds] 
});

const TARGET_MESSAGE = `# KURA ON TOP‼️ #　@everyone https://discord.gg/d3yJzthFkm\nhttps://discord.gg/yXKCyG3P4 https://discord.gg/SaFYUZdx9 https://discord.gg/projectreal https://discord.gg/matchalattewin https://discord.gg/weaoxyz https://discord.gg/Jku6xxjV https://discord.gg/yPmpmYAVN https://discord.gg/zBjVYAphr`;
const SEND_COUNT = 100; // BAN対策として100回を上限とする
const SEND_INTERVAL_MS = 500; // 500ms間隔

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'kura_s') {
        // コマンドを受け取ったことをDiscordに返す（これをしないとエラーになる）
        await interaction.reply({ content: '送信を開始します...', ephemeral: true });

        let count = 0;
        const sendLoop = async () => {
            if (count >= SEND_COUNT) {
                await interaction.followUp({ content: '上限に達したため送信を完了しました。', ephemeral: true }).catch(() => {});
                return;
            }
            
            try {
                // Interaction Tokenを利用した高速送信
                // User Appなら、サーバーにBotがいなくても送信可能
                await interaction.followUp({ content: TARGET_MESSAGE });
                count++;
                
                // 次の送信をスケジュール
                if (count < SEND_COUNT) {
                    setTimeout(sendLoop, SEND_INTERVAL_MS);
                }
            } catch (error) {
                console.error('メッセージ送信に失敗しました:', error.message);
                
                // レート制限(429)などで失敗した場合は少し長めに待ってからリトライ
                setTimeout(sendLoop, SEND_INTERVAL_MS * 4);
            }
        };

        sendLoop();
    }
});

client.login(process.env.DISCORD_TOKEN);
