// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })

// Imports
import { bot } from './helpers/bot'
import { attachChat } from './middleware/attachChat'
import { checkIfYouTube, addEditCheck } from './middleware/checkIfYouTube'
import { setupYouTubeLinks, setupVoteAction } from './helpers/youtube'

// Check if vote
setupVoteAction(bot)
// Adding edit check
addEditCheck(bot)
// Check if YouTube link
bot.use(checkIfYouTube)
// Attach chat to the ctx
bot.use(attachChat)
// Setup vote start for the YouTube links
setupYouTubeLinks(bot)

bot.startPolling()

console.info('Bot is up and running!')
