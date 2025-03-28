require('dotenv').config()
const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

const token = process.env.TOKEN;
const GAME_URL = process.env.GAME_URL;
const BOT_URL = process.env.BOT_URL;

const bot = new Telegraf(token);
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// Handle /start command with referral
bot.command('start', async (ctx) => {
  try {
    // Get the referral code from the start command if it exists
    const startPayload = ctx.message.text.split(' ')[1];

    // Construct the game URL with the referral code using the new format
    const gameUrl = startPayload
      ? `${GAME_URL}?tgWebAppStartParam=${startPayload}`
      : GAME_URL;

    await ctx.replyWithMarkdown(
      `Welcome to QuaserTap! 🚀✨ \n\n` +
      `I'm VENKO, your friendly cosmic companion, here to guide you through an epic space adventure!\n\n` +
      `Your journey begins now - become a legend among the stars. Blast off and happy tapping! 🌌🛸`,
      Markup.inlineKeyboard([
        Markup.button.webApp('START', gameUrl)
      ])
    );
  } catch (error) {
    console.error('Error in start command:', error);
    ctx.reply('Sorry, something went wrong. Please try again.');
  }
});

// Webhook route for Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Set up webhook
const url = BOT_URL + token;
bot.telegram.setWebhook(url);