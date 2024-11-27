// Подключаем библиотеку dotenv
require('dotenv').config();
// Обращаемся к библиотеке grammy и импортируем из неё класс Bot
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy');
// Создаем своего бота на основе импортированного класса, передавая в качестве аргумента ссылку на полученный ранее токен
// А нахуя - непонятно, ведь с прямой записью токена в скобки - тоже работает
const bot = new Bot (process.env.BOT_API_KEY);
//подключаем базу ответов
const { answers } = require('./base.js');
//Создаем клавиатуры
const keyboard1 = new Keyboard()
.text('Памагити').resized();
const helpKey = new InlineKeyboard()
.text('Я ничего не понимаю', 'quest').row()
.text('Я бухой', 'drunk').row()
.text('Я в опасности не по игре', 'danger').row()
.text('Ни с чем, я так', 'cancel');
const dangerKey = new InlineKeyboard()
.text('У бассейна', 'pool').text('На втором этаже', '2floor').row()
.text('На третьем этаже', '3floor').text('Снаружи', 'outside').row()
.text('Вернутся к прошлому выбору', 'back');
const ritualKey = new InlineKeyboard()
.text('Дематериализоваться!', 'ritualStop');
let helpMessage = '';

// Ответ на команду /start
bot.command('start', async (ctx) => {
    await ctx.reply(
        'А здесь удобно вести заметки...', {
            reply_markup: keyboard1,
        }        
    );
});
// Фильтр на голосовые
bot.on(":voice", async (ctx) => {
    await ctx.reply(
        'Этот шум не вызывает у меня ничего, кроме отвращения'
    );
});
// Фильтр на фотки
bot.on(":photo", async (ctx) => {
    await ctx.reply(
        'Художественные таланты доказаны, но лучше бы понять - что же это?'
    );
});
// автоответ на виновского
bot.hears(/виновский/i, async (ctx) => {
    await ctx.reply(
        'Пьет вино в больших количествах, ибо течет насквозь'
    );
});
bot.hears('Памагити', async (ctx) => {
    await ctx.reply(
        'С чем тебе помочь?', {reply_markup: helpKey}
    );
});
// Форма спасения утопающих. id мастерского чата -1002417460072
bot.callbackQuery('quest', async (ctx) => {
    await ctx.answerCallbackQuery({text: 'Подумай ещё',});
    await ctx.api.editMessageText (ctx.chat.id, ctx.update.callback_query.message.message_id,'Наверное надо подумать ещё... Ну или обратись к мастерам'); 
});
bot.callbackQuery('drunk', async (ctx) => {
    await ctx.answerCallbackQuery({text: 'Иди проспись',});
    //await ctx.reply('Где ты?', {reply_markup: dangerKey});
    await ctx.api.editMessageText (ctx.chat.id, ctx.update.callback_query.message.message_id, 'Где ты?', {reply_markup: dangerKey});
    helpMessage = 'опять в нули '; 
});
bot.callbackQuery('danger', async (ctx) => {
    await ctx.answerCallbackQuery({text: 'Уточни',}); 
    //await ctx.reply('Где ты?', {reply_markup: dangerKey,});
    await ctx.api.editMessageText (ctx.chat.id, ctx.update.callback_query.message.message_id, 'Где ты?', {reply_markup: dangerKey});
    helpMessage = "подыхает ";  
});
bot.callbackQuery('cancel', async (ctx) => {
    await ctx.api.editMessageText (ctx.chat.id, ctx.update.callback_query.message.message_id, 'И хорошо');
});
bot.callbackQuery('pool', async (ctx) => {
    await ctx.answerCallbackQuery({text: 'Сообщение передано мастерам'});
    await ctx.api.editMessageText (ctx.chat.id, ctx.update.callback_query.message.message_id,'Помощь идет к тебе, но лучше позвони +79217802927');
    helpMessage = '@' + ctx.from.username + ' ' + helpMessage +" у бассейна или в нем";
    await bot.api.sendMessage(-1002417460072, helpMessage);
    helpMessage = "";
});
bot.callbackQuery('2floor', async (ctx) => {
    await ctx.answerCallbackQuery({text: 'Сообщение передано мастерам'});
    await ctx.api.editMessageText (ctx.chat.id, ctx.update.callback_query.message.message_id,'Помощь идет к тебе, но лучше позвони +79217802927');
    helpMessage = '@' + ctx.from.username + ' ' + helpMessage + " на втором этаже";
    await bot.api.sendMessage(-1002417460072, helpMessage);
    helpMessage = "";
});
bot.callbackQuery('3floor', async (ctx) => {
    await ctx.answerCallbackQuery({text: 'Сообщение передано мастерам'});
    await ctx.api.editMessageText (ctx.chat.id, ctx.update.callback_query.message.message_id,'Помощь идет к тебе, но лучше позвони +79217802927');
    helpMessage = '@' + ctx.from.username + ' ' + helpMessage + " на третьем этаже";
    await bot.api.sendMessage(-1002417460072, helpMessage);
    helpMessage = "";
});
bot.callbackQuery('outside', async (ctx) => {
    await ctx.answerCallbackQuery({text: 'Сообщение передано мастерам'});
    await ctx.api.editMessageText (ctx.chat.id, ctx.update.callback_query.message.message_id,'Помощь идет к тебе, но лучше позвони +79217802927');
    helpMessage = '@' + ctx.from.username + ' ' + helpMessage + " снаружи дома";
    await bot.api.sendMessage(-1002417460072, helpMessage);
    helpMessage = "";
});
bot.callbackQuery('back', async (ctx) => {
    await await ctx.api.editMessageText (ctx.chat.id, ctx.update.callback_query.message.message_id, 'С чем тебе помочь?', {reply_markup: helpKey});
    helpMessage = '';
});
//Дата и время окончания игры в формате (Год, Месяц-1, число, часы, минуты, секунды) сейчас 1.12.2024 00:00.00
let finish = new Date(2024, 11, 1, 3, 0, 0);
bot.hears('Древние таинственные загадочные часы', async (ctx) => {
    let now = new Date(finish - new Date() - 3*3600000);
    await ctx.reply('Осталось ' + (now.getHours()/10<1?'0'+now.getHours():now.getHours()) + ':' + (now.getMinutes()/10<1?'0'+now.getMinutes():now.getMinutes()) + '.' + now.getSeconds());
});
bot.hears('Ну мам, ну еще десять минуточек', async (ctx) => {
    finish = new Date(finish.getTime() + 10*60000);
    await ctx.reply('Ну хорошо, но только десять');
    await bot.api.sendMessage(-1002417460072, 'Игра продлена на 10 минут, до ' + (finish.getHours()/10<1?'0'+finish.getHours():finish.getHours()) + ':' + (finish.getMinutes()/10<1?'0'+finish.getMinutes():finish.getMinutes()) + '.' + finish.getSeconds()+ '0');
});
bot.hears('Ну мам, ну я домой хочу', async (ctx) => {
    finish = new Date(finish.getTime() - 10*60000);
    await ctx.reply('Спешу как могу, солнышко');
    await bot.api.sendMessage(-1002417460072, 'Игра сокращена на 10 минут, до ' + (finish.getHours()/10<1?'0'+finish.getHours():finish.getHours()) + ':' + (finish.getMinutes()/10<1?'0'+finish.getMinutes():finish.getMinutes()) + '.' + finish.getSeconds()+'0');
});
//Пул пар ["ключ@пользователь", "ответ"] - выведен в отдельный модуль, здесь только шаблон
// const answers = new Map([
    // ['',''],
// ]);
let idd;
let itime = 18;
let aaa2 = 0;
let mess;
function aaa() {--itime?bot.api.editMessageText(idd, mess, 'Вы материальны еще ' + itime*10 + ' секунд',{reply_markup: ritualKey}):(clearInterval(aaa2), bot.api.sendMessage(idd, "Всё"), itime=18, aaa2 = 0)};
//команда для обратного отсчета setInterval(aaa, X), где Х = шаг в милисекундах
bot.hears('Очень тайный ритуал воплощения', async (ctx) => {
    !aaa2?(await ctx.reply('Ритуал сработал и вы вдруг стали материальны!', {reply_markup:ritualKey}),idd = ctx.chat.id,mess=ctx.message.message_id+1,aaa2 = setInterval(aaa, 10000), bot.api.sendMessage(-1002417460072, '@' + ctx.from.username + ' стал материальным')): ctx.reply("Ритуал уже действует на кого-то другого, и эфир возмущен слишком сильно для еще одной попытки");
});
bot.callbackQuery('ritualStop', async (ctx) => {
    clearInterval(aaa2);
    aaa2=0;
    bot.api.editMessageText(idd, mess,'Вы снова бестелесы и спокойны');
    bot.api.sendMessage(idd, 'Всё');
    bot.api.sendMessage(-1002417460072, '@' + ctx.from.username + ' стал нематериальным');
});
bot.hears('Изыди, нечисть!', async (ctx) => {
    ctx.reply('Да ты прям инквизитор');
    clearInterval(aaa2);
    aaa2=0;
    bot.api.editMessageText(idd, mess,'Вас внезапно дематериализовало');
    bot.api.sendMessage(idd, 'Всё');
    bot.api.sendMessage(-1002417460072, '@' + ctx.from.username + ' стал нематериальным');
});
//слушатель запросов
bot.on(':text', async (ctx) => {
    let question = ctx.message.text + '@' + ctx.from.username;
    answers.get(question)===undefined? await ctx.reply('Хмм, это кажется знакомым, но не могу вспомнить почему...'):await ctx.reply(answers.get(question));
});
// // пул пользователей в массиве
// const users = [
//     "@fattrampoline",
//     ''
// ];

//Заглушки
//На случай, если хз что ответить и пришел не текст, не картинка и не голосовуха
bot.on("message", async (ctx) => {
    await ctx.reply('Что это?');
});
// Обработчик ошибок (не мой, с хабра)
bot.catch((err) => { const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`); const e = err.error;
    if (e instanceof GrammyError) {
     console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) { console.error('Could not contact Telegram:', e);
    } else {
    console.error('Unknown error:', e);
    }
});


// Запускаем созданного бота
bot.start();
