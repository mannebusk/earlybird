import SlackBot     from 'slackbots';
import msgUtil      from "./message-patterns.js";
import moment       from "moment";
import Storage      from "./storage.js";
import fs           from "fs";

// Read slack bot token from file
const TOKEN = fs.readFileSync(
  __dirname + "/../token.txt",
  {encoding: "utf-8"}
).trim();

// Create & load game storage
const db = {};
db.games = new Storage("../.db/games");

// Bot settins
const botData = {
  icon_url: "http://ioacongress2016.org/wp-content/uploads/2016/02/earlybird.jpg",
  username: "earlybird"
};

/**
 * Say message
 *
 * @param {string}
 */
function say(message) {
  bot.postMessageToChannel('general', message, botData); 
}

/**
 * Get message stripped of mentions.
 *
 * @param {string}
 * @return {string}
 */
function getMessage(message) {
  return message.replace(/^(<@(.*)>)/gi, "").trim();
}

/**
 * Get all mentions from message string
 *
 * @param {string}
 * @return {array}
 */
function getMentions(message) {
  if (/^(<@(.*)>)/gi.test(message)) {
    return /^<@(.*)>/gi.match(message)
  }

  return null;
}

/**
 * Get user data from id
 *
 * @param {string}
 * @return {object}
 */
function getUser(userID) {
  let users = bot.getUsers()._value.members || [];
  return users.filter(user => user.id === userID).pop();
}

/**
 * Get a new empty game
 *
 * @return {object}
 */
function newGame() {
  return {
    date: moment().format("YYYY-MM-DD"),
    claims: []
  }
}

/**
 * Get a date stamp of todays date
 *
 * @return {string}
 */
function dateStamp() {
  return moment().format("YYYY-MM-DD");
}

/**
 * Get a new claim object
 *
 * @param {string}
 * @return {object}
 */
function makeClaim(userId) {
  return {
    user: userId,
    time: Date.now()
  };
}

// Create a new Slack Bot
const bot = new SlackBot({
  token: TOKEN,
  name: botData.username
});

// Join general channel on start by sending a message
bot.on("start", () => {
  say("Cock-A-Doodle-Doo!");
});

// Handle messages set in channel
bot.on("message", (data) => {
  if (!data.type === 'message'
      || typeof data.text === 'undefined'
      || data.subtype === 'bot_message'
  ) {
    return;
  }

  const BotID     = bot.self.id;
  let   message   = getMessage(data.text);
  let   mentions  = getMentions(data.text);
  let   user      = getUser(data.user);

  let game = db.games.get(dateStamp());
  if (!game) {
    game = newGame();
  }
  let userClaims = game.claims.filter(c => c.user === data.user);
  let claimCount = game.claims.length;

  switch (true) {
    /**
     * Claiming a win
     */
    case msgUtil.claimingWin(message):
      if (userClaims.length) {
        say(`Spamming doesn't make you a winner ...`);
        break;
      }

      if (!userClaims.length) {
        if (!game.claims.length) {
          say(`${user.name}, you are a true winner. Gratz!`);
        } else {
          let firstClaim = game.claims[0];
          let userName = getUser(firstClaim.user).name;
          say(`Yeah, you can always hope that ${userName} falls asleep ....`);
        }
        game.claims.push(makeClaim(data.user));
      }

      db.games.insert(game.date, game).persist();
      break;

    /**
     * Taking back a claim
     */
    case msgUtil.takingBackClaim(message):
      if (!claimCount) {
        say(`Oh... Here is you chanse to become a winner!`);
        break;
      }

      if (claimCount && !userClaims.length) {
        say(`You have to play to be able to loose`);
        break;
      }

      let firstClaim = game.claims[0];
      let winner = getUser(firstClaim.user);

      if (!firstClaim.user === data.user) {
        say(`Yeah I know you lost... ${user.name} is the champion of today.`);
        break;
      }

      if (winner.id === data.user) {
        game.claims.splice(0, 1);
        db.games.insert(game.date, game).persist();
        say(`Hah! what a looser...`);

        if (game.claims.length) {
          let newWinner = getUser(game.claims[0].user);
          say(`Congratz to the new winner ${newWinner.name}!!`);
        } else {
          say(`The title is now up for grabs!`);
        }
      }

      break;

    /**
     * Checking the stats
     */
    case msgUtil.checkStats(message):
      let scores = {};
      db.games.forEach((game) => {
        if (!game.claims.length) {
          return;
        }

        let winner = game.claims[0].user;

        if (!scores.hasOwnProperty(winner)) {
          scores[winner] = 1;
        } else {
          scores[winner] += 1;
        }
      });

      let highscore = [];
      Object.keys(scores).forEach((userId) => {
        highscore.push({
          name: getUser(userId).name,
          points: scores[userId]
        });
      });

      highscore = highscore.sort((a, b) => b.points - a.points);

      let sayScore = "High score:\n";

      sayScore += "```";
      highscore.forEach((entry, idx) => {
        let index = idx + 1;
        sayScore += `${index}. ${entry.name}\n   points: ${entry.points} \n`;
      });
      sayScore += "```";

      say(sayScore);
      break;
  }
});
