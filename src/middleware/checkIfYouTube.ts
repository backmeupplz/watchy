// Imports
import { Telegraf } from 'telegraf'
import { ContextMessageUpdate } from 'telegraf'
import { report } from '../helpers/reporter'
import { findMessage } from '../models/Message'

export async function checkIfYouTube(ctx: ContextMessageUpdate, next) {
  try {
    if (
      ctx.message &&
      ctx.message.text &&
      /^((?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\-_]+))$/.test(
        ctx.message.text
      )
    ) {
      next()
    } else {
      await ctx.deleteMessage()
    }
  } catch (err) {
    await report(ctx.telegram, err)
  }
}

export async function addEditCheck(bot: Telegraf<ContextMessageUpdate>) {
  bot.on('edited_message', async ctx => {
    try {
      await ctx.deleteMessage()
      const voteMessage = (await findMessage(
        ctx.message.message_id,
        ctx.chat.id
      )).voteMessageId
      await ctx.telegram.deleteMessage(ctx.chat.id, voteMessage)
    } catch (err) {
      report(ctx.telegram, err)
    }
  })
}
