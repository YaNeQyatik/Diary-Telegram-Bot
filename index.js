const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Render сам назначает порт

// Минимальный эндпоинт для проверки
app.get('/', (req, res) => {
  res.send('Telegram bot is running!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import { Telegraf } from 'telegraf';
let bot = new Telegraf('7830090812:AAFM-5TH2TizkKIwy1yVh-gWv-wIlhACkGg');
const map = new Map();

bot.start((ctx) => {
    ctx.replyWithHTML(`
    👋 Здравствуйте, <b>${ctx.from.first_name}</b>!
📄 Здесь Вы можете делать свои записки, прямо как в личном дневнике.
📚 Чтобы сделать запись, просто используйте команду <b>/newentry «текст»</b>.
👀 Чтобы просмотреть все записи, используйте команду <b>/notebook</b>.
    `);
});

bot.command('newentry', (ctx) => {
    let user = ctx.from.id;
    let text = ctx.message.text.split(' ').slice(1).join(' ');
    if (!map.has(user)) {
      map.set(user, []);
    }
    map.get(user).push({ text });
    ctx.reply(`Запись «${text}» успешно сохранена!`);
});

bot.command('notebook', (ctx) => {
  const user = ctx.from.id;
  const notes = map.get(user) || [];
  if (notes.length === 0) {
    ctx.reply('У Вас ещё нет записей!\nСоздайте их по команде /newentry «текст»');
    return;
  }
  let response = '📚 Твои записи:\n\n';
  notes.forEach((note, index) => {
    response += `${index}. ${note.text}\n`;
  });
  ctx.reply(response);
});

bot.launch();
