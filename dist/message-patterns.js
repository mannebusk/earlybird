"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Collection of message patterns
 */
exports.default = {
  claimingWin: function claimingWin(text) {
    return (/^(I win)/gi.test(text)
    );
  },
  takingBackClaim: function takingBackClaim(text) {
    return (/^(I loose|I[']?m a looser|I am a looser|I lost)/gi.test(text)
    );
  },
  checkStats: function checkStats(text) {
    return (/^(show stats|check stats|Who is winning[?]?)$/gi.test(text)
    );
  }
};