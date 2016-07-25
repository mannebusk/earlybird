# earlybird
This is a slack bot that keeps track of who is winning.

## Rules
The first person who writes "I win" in the general channel after he or shes
nightly sleep wins.

If you fall asleep after claiming your win, it doesn't count. Then you have to
be gentleman and type in "I'm a looser" in the general channel to take back
your claim. The person who typed "I win" first after you becomes the new
winner.

If you are located in a time zone different then the majority of the people in
the channel, you are not allowed to play.


### Commands
Claim a win
```
  I win
```

Take back a claim
```
  I'm a looser
```

Show highscore
```
  Show stats
```


### Start bot
Clone the repo, run ```npm install```, put yout slack bot token in a file named
*token.txt* and then run the bot with ```node dist/bot.js```.
