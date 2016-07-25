"use strict";

var _slackbots = require("slackbots");

var _slackbots2 = _interopRequireDefault(_slackbots);

var _messagePatterns = require("./message-patterns.js");

var _messagePatterns2 = _interopRequireDefault(_messagePatterns);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _storage = require("./storage.js");

var _storage2 = _interopRequireDefault(_storage);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Read slack bot token from file
var TOKEN = _fs2.default.readFileSync(__dirname + "/../token.txt", { encoding: "utf-8" }).trim();

// Create & load game storage
var db = {};
db.games = new _storage2.default("../.db/games");

// Bot settins
var botData = {
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
    return (/^<@(.*)>/gi.match(message)
    );
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
  var users = bot.getUsers()._value.members || [];
  return users.filter(function (user) {
    return user.id === userID;
  }).pop();
}

/**
 * Get a new empty game
 *
 * @return {object}
 */
function newGame() {
  return {
    date: (0, _moment2.default)().format("YYYY-MM-DD"),
    claims: []
  };
}

/**
 * Get a date stamp of todays date
 *
 * @return {string}
 */
function dateStamp() {
  return (0, _moment2.default)().format("YYYY-MM-DD");
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
var bot = new _slackbots2.default({
  token: TOKEN,
  name: botData.username
});

// Join general channel on start by sending a message
bot.on("start", function () {
  say("Cock-A-Doodle-Doo!");
});

// Handle messages set in channel
bot.on("message", function (data) {
  if (!data.type === 'message' || typeof data.text === 'undefined' || data.subtype === 'bot_message') {
    return;
  }

  var BotID = bot.self.id;
  var message = getMessage(data.text);
  var mentions = getMentions(data.text);
  var user = getUser(data.user);

  var game = db.games.get(dateStamp());
  if (!game) {
    game = newGame();
  }
  var userClaims = game.claims.filter(function (c) {
    return c.user === data.user;
  });
  var claimCount = game.claims.length;

  (function () {
    switch (true) {
      /**
       * Claiming a win
       */
      case _messagePatterns2.default.claimingWin(message):
        if (userClaims.length) {
          say("Spamming doesn't make you a winner ...");
          break;
        }

        if (!userClaims.length) {
          if (!game.claims.length) {
            say(user.name + ", you are a true winner. Gratz!");
          } else {
            var _firstClaim = game.claims[0];
            var userName = getUser(_firstClaim.user).name;
            say("Yeah, you can always hope that " + userName + " falls asleep ....");
          }
          game.claims.push(makeClaim(data.user));
        }

        db.games.insert(game.date, game).persist();
        break;

      /**
       * Taking back a claim
       */
      case _messagePatterns2.default.takingBackClaim(message):
        if (!claimCount) {
          say("Oh... Here is you chanse to become a winner!");
          break;
        }

        if (claimCount && !userClaims.length) {
          say("You have to play to be able to loose");
          break;
        }

        var firstClaim = game.claims[0];
        var winner = getUser(firstClaim.user);

        if (!firstClaim.user === data.user) {
          say("Yeah I know you lost... " + user.name + " is the champion of today.");
          break;
        }

        if (winner.id === data.user) {
          game.claims.splice(0, 1);
          db.games.insert(game.date, game).persist();
          say("Hah! what a looser...");

          if (game.claims.length) {
            var newWinner = getUser(game.claims[0].user);
            say("Congratz to the new winner " + newWinner.name + "!!");
          } else {
            say("The title is now up for grabs!");
          }
        }

        break;

      /**
       * Checking the stats
       */
      case _messagePatterns2.default.checkStats(message):
        var scores = {};
        db.games.forEach(function (game) {
          if (!game.claims.length) {
            return;
          }

          var winner = game.claims[0].user;

          if (!scores.hasOwnProperty(winner)) {
            scores[winner] = 1;
          } else {
            scores[winner] += 1;
          }
        });

        var highscore = [];
        Object.keys(scores).forEach(function (userId) {
          highscore.push({
            name: getUser(userId).name,
            points: scores[userId]
          });
        });

        highscore = highscore.sort(function (a, b) {
          return b.points - a.points;
        });

        var sayScore = "High score:\n";

        sayScore += "```";
        highscore.forEach(function (entry, idx) {
          var index = idx + 1;
          sayScore += index + ". " + entry.name + "\n   points: " + entry.points + " \n";
        });
        sayScore += "```";

        say(sayScore);
        break;
    }
  })();
});