export function checkIfErrorDismissable(error: Error) {
  const dismissableMessages = [
    "message can't be deleted",
    'bot was kicked from the supergroup',
    'group chat was upgraded to a supergroup',
  ]
  for (const message of dismissableMessages) {
    if (error.message.indexOf(message) > -1) {
      return true
    }
  }
  return false
}
