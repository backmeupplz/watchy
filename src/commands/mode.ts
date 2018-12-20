// Dependencies
import { Telegraf, ContextMessageUpdate, Extra } from 'telegraf'
import { report } from '../helpers/reporter'
import { Mode } from '../models'

export function setupMode(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('mode', async (ctx, next) => {
    try {
      const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id)
      if (admins.map(m => m.user.id).indexOf(ctx.from.id) > -1) {
        let chat = ctx.dbchat
        chat.mode = chat.mode === Mode.YouTube ? Mode.Pictures : Mode.YouTube
        chat = await (chat as any).save()
        await ctx.replyWithMarkdown(
          chat.mode === Mode.YouTube
            ? 'Теперь будет удаляться все, кроме ссылок на YouTube'
            : 'Теперь будет удаляться все, кроме картинок и гифок'
        )
      }
    } catch (err) {
      report(ctx.telegram, err)
    } finally {
      next()
    }
  })
}
