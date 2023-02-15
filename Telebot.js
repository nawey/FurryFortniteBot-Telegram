const TelegramBot = require('node-telegram-bot-api');
var fs = require ('fs');
var path = require ('path');
var schedule = require('node-schedule');
var moment = require ("moment/moment.js");
const { token } = require('./auth.json');
var subbedChannels = require('./subcriptions.json');

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

const bot = new TelegramBot(token, {polling: true});

//send curated list on parsing text
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

//send curated list on command
bot.onText(/\/itemshop/, (msg) => {
  const chatId = msg.chat.id;
console.log('sending to' +chatId);
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

//add to list when added to a channel
bot.on('my_chat_member', (msg) => {
  const cType = msg.chat.type;
  if (cType == "channel") {
    const chatId = msg.chat.id;
    console.log("Channels subbed so far: "+subbedChannels);
    console.log('Bot added to the channel: ' + chatId);
    subbedChannels.push(chatId);
    console.log("Channels after concat: "+subbedChannels);
    
    var subs2add = JSON.stringify(subbedChannels);
    
    fs.writeFile('subcriptions.json', subs2add, err => {
    if (err) throw err; });
    }
    else {
      console.log ('type of chat is not channel.')
    }
});

// register command
bot.onText(/\/register/, (msg) => {
  const chatId = msg.chat.id;
  if (subbedChannels.includes(chatId) == true)  {
    bot.sendMessage(chatId, "Your channel is already registered.")
  }
  else if (subbedChannels.includes(chatId) == false) {
    console.log("Channels subbed so far: "+subbedChannels);
    console.log("Channel to add: "+chatId);
  bot.sendMessage(chatId, "Your channel has been registered. You will get daily updates of the item shop at 7:20pm EST.");

  subbedChannels.push(chatId);
  console.log("Channels after concat: "+subbedChannels);

  var subs2add = JSON.stringify(subbedChannels);

  fs.writeFile('subcriptions.json', subs2add, err => {
    if (err) throw err;
  });
}

});

// deregister command
bot.onText(/\/deregister/, (msg) => {
 
  const chatId = msg.chat.id;

  if (subbedChannels.includes(chatId) == true)  {

    console.log("Channels subbed so far: "+subbedChannels);
    console.log("Channel to remove: "+chatId);

    bot.sendMessage(chatId, "Your channel notifications have been turned off");

// identify index of element to remove

  const index2Remove = (element) => element == chatId;

    const removeIndex = subbedChannels.findIndex(index2Remove);
    console.log("this is the index to remove " + removeIndex);

    delete subbedChannels[removeIndex];

    console.log("this is the array after removal " + subbedChannels);

    subbedChannels.sort();
    console.log("Array sorted: " + subbedChannels);

    subbedChannels.pop();

    console.log("Channels after removal: "+subbedChannels);

    var subs2add = JSON.stringify(subbedChannels);

    fs.writeFile('subcriptions.json', subs2add, err => {
    if (err) throw err; });}

  else if (subbedChannels.includes(chatId) == false) {
   
    bot.sendMessage(chatId, "Your channel has notifications off.")
  
  }


});

// Daily message
schedule.scheduleJob('20 18 * * *', async function(){
    
  subbedChannels.forEach(chatId => {
    
    console.log('[INFO] Running bot on the ' + runningdate);
  
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
