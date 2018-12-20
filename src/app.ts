// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })

// Imports
import { bot } from './helpers/bot'

bot.on('message', ctx => {
  ctx.reply('Ну привет-привет!')
})
