/**
 * Collection of message patterns
 */
export default {
  claimingWin: text => /^(I win)/gi.test(text),
  takingBackClaim: text => /^(I loose|I[']?m a looser|I am a looser|I lost)/gi.test(text),
  checkStats: text => /^(show stats|check stats|Who is winning[?]?)$/gi.test(text)
}
