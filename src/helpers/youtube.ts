import Telegraf, { ContextMessageUpdate, Extra } from 'telegraf'
import { addMessage, findMessage } from '../models/Message'
import { report } from './reporter'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
const { Lock } = require('semaphore-async-await')

enum Action {
  Up = 1,
  Down = 2,
}

const likeMessage = 'Нравится?'

export function setupYouTubeLinks(bot: Telegraf<ContextMessageUpdate>) {
  bot.on('message', async ctx => {
    const message = await addMessage(
      ctx.message.message_id,
      ctx.chat.id,
      ctx.message
    )

    const voteMessage = await ctx.reply(
      likeMessage,
      Extra.inReplyTo(message.id).markup(m =>
        m.inlineKeyboard([
          m.callbackButton(
            '👍',
            `${Action.Up}~${ctx.message.message_id}~${ctx.chat.id}`
          ),
          m.callbackButton(
            '👎',
            `${Action.Down}~${ctx.message.message_id}~${ctx.chat.id}`
          ),
        ])
      )
    )

    message.voteMessageId = voteMessage.message_id
    await (message as any).save()
  })
}

export function setupVoteAction(bot: Telegraf<ContextMessageUpdate>) {
  bot.action(/.+~.+~.+/, async ctx => {
    const lock = new Lock(1)
    lock.acquire()
    try {
      const [action, id, chatId] = ctx.callbackQuery.data
        .split('~')
        .map(s => parseInt(s))
      let message = await findMessage(id, chatId)
      // Check if there is message
      if (!message) {
        return ctx.answerCbQuery('Сообщение не найдено')
      }
      // Check if not voted yet
      if (
        (action === Action.Down &&
          message.downvoted.indexOf(ctx.from.id) > -1) ||
        (action === Action.Up && message.upvoted.indexOf(ctx.from.id) > -1)
      ) {
        return ctx.answerCbQuery('Вы уже проголосовали')
      }
      // Add the vote
      if (action === Action.Up) {
        message.downvoted = message.downvoted.filter(id => id !== ctx.from.id)
        message.upvoted.push(ctx.from.id)
      } else {
        message.upvoted = message.upvoted.filter(id => id !== ctx.from.id)
        message.downvoted.push(ctx.from.id)
      }
      // Save the message
      message = await (message as any).save()
      // Update the message
      await ctx.telegram.editMessageText(
        message.chatId,
        message.voteMessageId,
        undefined,
        likeMessage,
        Extra.inReplyTo(message.id).markup(m =>
          m.inlineKeyboard([
            m.callbackButton(
              `${message.upvoted ? message.upvoted.length : 0} 👍`,
              `${Action.Up}~${message.id}~${message.chatId}`
            ),
            m.callbackButton(
              `${message.downvoted ? message.downvoted.length : 0} 👎`,
              `${Action.Down}~${message.id}~${message.chatId}`
            ),
          ])
        )
      )
      await ctx.answerCbQuery('Спасибо за голос!')
    } catch (err) {
      await report(ctx.telegram, err)
    } finally {
      lock.release()
    }
  })
}
