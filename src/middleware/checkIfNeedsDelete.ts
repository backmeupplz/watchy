// Imports
import { Telegraf } from 'telegraf'
import { ContextMessageUpdate } from 'telegraf'
import { report } from '../helpers/reporter'
import { findMessage } from '../models/Message'
import { Mode } from '../models'
import * as request from 'async-request'

export async function checkIfNeedsDelete(ctx: ContextMessageUpdate, next) {
  try {
    let isValid = false
    if (ctx.dbchat.mode === Mode.Pictures) {
      if (
        ctx.message &&
        (ctx.message.animation || (ctx.message.photo && !ctx.message.caption))
      ) {
        isValid = true
      }
    } else {
      if (
        ctx.message &&
        ctx.message.text &&
        /^((?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\-_]+))$/.test(
          ctx.message.text
        )
      ) {
        try {
          const response = await request(ctx.message.text)
          if (
            response.body.indexOf(
              '<h1 id="unavailable-message" class="message">'
            ) < 0
          ) {
            isValid = true
          }
        } catch (err) {
          // Do nothing, not valid
        }
      }
    }
    if (isValid) {
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
        ctx.editedMessage.message_id,
        ctx.chat.id
      )).voteMessageId
      await ctx.telegram.deleteMessage(ctx.chat.id, voteMessage)
    } catch (err) {
      report(ctx.telegram, err)
    }
  })
}
