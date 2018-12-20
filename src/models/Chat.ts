// Imports
import { prop, Typegoose } from 'typegoose'

export class Chat extends Typegoose {
  @prop({ required: true, index: true, unique: true })
  id: number
}

// Get Chat model
const ChatModel = new Chat().getModelForClass(Chat, {
  schemaOptions: { timestamps: true },
})

// Get or create chat
export async function findChat(id: number) {
  let chat = await ChatModel.findOne({ id })
  if (!chat) {
    try {
      chat = await new ChatModel({ id }).save()
    } catch (err) {
      chat = await ChatModel.findOne({ id })
    }
  }
  return chat
}
