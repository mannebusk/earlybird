import chai from "chai";
import messages   from "../message-patterns.js";
const should = chai.should();

function testMessages(messages, testFunc, truth) {
  messages.forEach((msg) => {
    let word = truth ? "" : "not";
    it(
      `Should ${word} match "${msg}"`,
      () => should.equal(testFunc(msg), truth)
    );
  });
}

describe("Messages", () => {
  describe("Claming a win", () => {
    let validMsgs = [
      "I win",
      "i win",
      "I win!",
      "I win! \o/",
    ];
    testMessages(validMsgs, messages.claimingWin, true);

    let invalidMsgs = [
      "So I said, i win!",
      "random string",
      "you win",
      "I, WIN",
      "Iwin",
    ];
    testMessages(invalidMsgs, messages.claimingWin, false);
  });

  describe("Taking back a claim", () => {
    let validMsgs = [
      "I loose",
      "I loose...",
      "I loose!",
      "I lost",
      "I lost.",
      "I lost! fuck!",
      "I'm a looser",
      "Im a looser",
      "I'm a looser, yes I am.",
      "I am a looser",
      "I am a looser, so what?.",
    ];
    testMessages(validMsgs, messages.takingBackClaim, true);

    let invalidMsgs = [
      "You loose",
      "I loos",
      "i lose",
      "Iloose",
      "I fucking loose",
      "Im loosing",
      "Ima looser",
      "Imalooser",
      "show stats",
      "I win!",
    ];
    testMessages(invalidMsgs, messages.takingBackClaim, false);

  });

  describe("Check who is winning", () => {
    let validMsgs = [
      "show stats",
      "check stats",
      "ShoW stats",
      "CHECK stats",
      "Who is winning",
      "Who is winning?",
    ];
    testMessages(validMsgs, messages.checkStats, true);

    let invalidMsgs = [
      "Who is winning this?",
      "show stats to me",
      "show stats?",
      "asd show stats",
      "Whoiswinning?",
      "who is winning??",
      "checkstats"
    ];
    testMessages(invalidMsgs, messages.checkStats, false);

  });
});
