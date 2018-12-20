// Imports
import { prop, Typegoose, arrayProp } from 'typegoose'
import * as Telegram from 'telegram-typings'

export class Message extends Typegoose {
  @prop({ required: true, index: true, unique: true })
  id: number
  @prop({ required: true, index: true })
  chatId: number
  @arrayProp({ items: Number, default: [], required: true })
  upvoted: Number[]
  @arrayProp({ items: Number, default: [], required: true })
  downvoted: Number[]
  @prop({ required: true })
  rawMessage: Telegram.Message

  @prop()
  voteMessageId: number
}

// Get Message model
const MessageModel = new Message().getModelForClass(Message, {
  schemaOptions: { timestamps: true },
})

// Create message
export function addMessage(
  id: number,
  chatId: number,
  rawMessage: Telegram.Message
): Promise<Message> {
  return new MessageModel({ id, chatId, rawMessage }).save()
}

// Get message
export function findMessage(
  id: number,
  chatId: number
): Promise<Message | undefined> {
  return MessageModel.findOne({ id, chatId })
}
