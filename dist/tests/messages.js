"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _messagePatterns = require("../message-patterns.js");

var _messagePatterns2 = _interopRequireDefault(_messagePatterns);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should();

function testMessages(messages, testFunc, truth) {
  messages.forEach(function (msg) {
    var word = truth ? "" : "not";
    it("Should " + word + " match \"" + msg + "\"", function () {
      return should.equal(testFunc(msg), truth);
    });
  });
}

describe("Messages", function () {
  describe("Claming a win", function () {
    var validMsgs = ["I win", "i win", "I win!", "I win! \o/"];
    testMessages(validMsgs, _messagePatterns2.default.claimingWin, true);

    var invalidMsgs = ["So I said, i win!", "random string", "you win", "I, WIN", "Iwin"];
    testMessages(invalidMsgs, _messagePatterns2.default.claimingWin, false);
  });

  describe("Taking back a claim", function () {
    var validMsgs = ["I loose", "I loose...", "I loose!", "I lost", "I lost.", "I lost! fuck!", "I'm a looser", "Im a looser", "I'm a looser, yes I am.", "I am a looser", "I am a looser, so what?."];
    testMessages(validMsgs, _messagePatterns2.default.takingBackClaim, true);

    var invalidMsgs = ["You loose", "I loos", "i lose", "Iloose", "I fucking loose", "Im loosing", "Ima looser", "Imalooser", "show stats", "I win!"];
    testMessages(invalidMsgs, _messagePatterns2.default.takingBackClaim, false);
  });

  describe("Check who is winning", function () {
    var validMsgs = ["show stats", "check stats", "ShoW stats", "CHECK stats", "Who is winning", "Who is winning?"];
    testMessages(validMsgs, _messagePatterns2.default.checkStats, true);

    var invalidMsgs = ["Who is winning this?", "show stats to me", "show stats?", "asd show stats", "Whoiswinning?", "who is winning??", "checkstats"];
    testMessages(invalidMsgs, _messagePatterns2.default.checkStats, false);
  });
});