// Dependencies
import { Telegram } from 'telegraf'
import { checkIfErrorDismissable } from './error'

export async function report(bot: Telegram, error: Error) {
  if (checkIfErrorDismissable(error)) {
    return
  }
  const adminChatId = process.env.ADMIN
  if (!adminChatId) return
  try {
    await bot.sendMessage(adminChatId, `\`\`\`${JSON.stringify(error)}\`\`\``, {
      parse_mode: 'Markdown',
    } as any)
  } catch {
    // Do nothing
  }
}
