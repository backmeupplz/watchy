// Imports
import { ContextMessageUpdate } from 'telegraf'
import { report } from '../helpers/reporter'

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
