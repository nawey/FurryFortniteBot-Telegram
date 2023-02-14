const TelegramBot = require('node-telegram-bot-api');
var fs = require ('fs');
var Buffer =require ('buffer');
var path = require ('path');
var schedule = require('node-schedule');
var moment = require ("moment/moment.js");
const { token } = require('./auth.json');
var subbedChannels = require('./subcriptions.json')

const runningdate = moment(Date.now()).format('MM/DD/YYYY');

console.log('[INFO] Starting bot on the ' + runningdate);


const getMostRecentFile = (dir) => {
    const files = orderReccentFiles(dir);
    return files.length ? files[0] : undefined;
  };

const orderReccentFiles = (dir) => {
    return fs.readdirSync(dir)
      .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
      .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
  };

// replace the value below with the Telegram token you receive from @BotFather
// const token = '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.
var subChannels = []

bot.on('message', (msg) => {
    var today = 'item shop';
    if  (msg.text.toString().toLowerCase().indexOf(today) === 0) {

  const chatId = msg.chat.id;

  const furryshoptoday = getMostRecentFile("/home/gamas/FNItemShopGenerator/ItemShopDaily");
  const furryemotestoday = getMostRecentFile("/home/gamas/FNItemShopGenerator/ItemShopEmotes");
  
  const skinsPath = path.join('/home/gamas/FNItemShopGenerator/ItemShopDaily/' + furryshoptoday.file);
  const emotesPath = path.join('/home/gamas/FNItemShopGenerator/ItemShopEmotes/' + furryemotestoday.file);

  const status = "These are the furry cosmetics and emotes that are available today on the Item shop! \n\n Use code FURRYBAIT in the Item Shop to support us! \n #EpicPartner #FurryFortnite";
  
  const streamSk = fs.createReadStream(skinsPath);
  const streamEm = fs.createReadStream(emotesPath);
  
  console.log(skinsPath);
  console.log(emotesPath);
  // send a message to the chat acknowledging receipt of their message

  bot.sendMessage(chatId, status);
  bot.sendPhoto(chatId, streamSk);
  bot.sendPhoto(chatId, streamEm);
    }
});

bot.onText(/\/itemshop/, (msg) => {
  const chatId = msg.chat.id;

  const furryshoptoday = getMostRecentFile("/home/gamas/FNItemShopGenerator/ItemShopDaily");
  const furryemotestoday = getMostRecentFile("/home/gamas/FNItemShopGenerator/ItemShopEmotes");
  
  const skinsPath = path.join('/home/gamas/FNItemShopGenerator/ItemShopDaily/' + furryshoptoday.file);
  const emotesPath = path.join('/home/gamas/FNItemShopGenerator/ItemShopEmotes/' + furryemotestoday.file);

  const status = "These are the furry cosmetics and emotes that are available today on the Item shop! \n\n Use code FURRYBAIT in the Item Shop to support us! \n #EpicPartner #FurryFortnite";
  
  const streamSk = fs.createReadStream(skinsPath);
  const streamEm = fs.createReadStream(emotesPath);
  
  console.log(skinsPath);
  console.log(emotesPath);
  // send a message to the chat acknowledging receipt of their message

  bot.sendMessage(chatId, status);
  bot.sendPhoto(chatId, streamSk);
  bot.sendPhoto(chatId, streamEm);
});

bot.on('my_chat_member', (msg) => {
const chatId = msg.chat.id;
console.log(chatId);
console.log("Channels subbed so far: "+subChannels);

});

bot.onText(/\/register/, (msg) => {
  const chatId = msg.chat.id;
  if (subbedChannels.includes(chatId) == false) {
    subChannels.push(chatId);
    console.log("Channels subbed so far: "+subChannels);
  bot.sendMessage(chatId, "Your channel has been registered. You will get daily updates of the item shop at 7:20pm EST.");

  var newSubs = JSON.stringify(subChannels);
  fs.writeFile('subcriptions.json', newSubs, err => {
    if (err) throw err;
  });

}
else {
  bot.sendMessage(chatId, "Your channel is already registered.")
}
});


schedule.scheduleJob('20 18 * * *', async function(){
    
  subbedChannels.forEach(chatId => {
    
    console.log('[INFO] Running bot on the ' + runningdate);
  
  //const chatId = msg.chat.id;

  const furryshoptoday = getMostRecentFile("/home/gamas/FNItemShopGenerator/ItemShopDaily");
  const furryemotestoday = getMostRecentFile("/home/gamas/FNItemShopGenerator/ItemShopEmotes");
  
  const skinsPath = path.join('/home/gamas/FNItemShopGenerator/ItemShopDaily/' + furryshoptoday.file);
  const emotesPath = path.join('/home/gamas/FNItemShopGenerator/ItemShopEmotes/' + furryemotestoday.file);

  const status = "These are the furry cosmetics and emotes that are available today on the Item shop! \n\n Use code FURRYBAIT in the Item Shop to support us! \n #EpicPartner #FurryFortnite";
  
  const streamSk = fs.createReadStream(skinsPath);
  const streamEm = fs.createReadStream(emotesPath);
  
  console.log(skinsPath);
  console.log(emotesPath);
  // send a message to the chat acknowledging receipt of their message
  
  bot.sendMessage(chatId, status);
  bot.sendPhoto(chatId, streamSk);
  bot.sendPhoto(chatId, streamEm);
});
});
