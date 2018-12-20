// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })

// Imports
import { bot } from './helpers/bot'
import { attachChat } from './middleware/attachChat'
import {
  checkIfNeedsDelete,
  addEditCheck,
} from './middleware/checkIfNeedsDelete'
import { setupYouTubeLinks, setupVoteAction } from './helpers/youtube'
import { setupMode } from './commands/mode'

// Attach chat
bot.use(attachChat)
// Check if vote
setupVoteAction(bot)
// Adding edit check
addEditCheck(bot)
// Add mode command
setupMode(bot)
// Check if YouTube link
bot.use(checkIfNeedsDelete)
// Attach chat to the ctx
bot.use(attachChat)
// Setup vote start for the YouTube links
setupYouTubeLinks(bot)

bot.startPolling()

console.info('Bot is up and running!')
